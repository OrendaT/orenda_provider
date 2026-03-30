import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RECIPIENT_EMAIL = 'susie@orendapsych.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const reportDate = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })

    // Get all confirmed bookings
    const { data: allBookings } = await supabase
      .from('office_bookings')
      .select('*')
      .eq('status', 'confirmed')

    const bookings = allBookings || []

    // Today's new bookings (created today)
    const newToday = bookings.filter(b =>
      b.created_at && b.created_at.startsWith(todayStr)
    ).length

    // Cancellations today
    const { data: cancelledToday } = await supabase
      .from('office_bookings')
      .select('id')
      .eq('status', 'cancelled')
      .gte('updated_at', todayStr)

    // Location breakdown
    const hoboken = bookings.filter(b => b.office_location === 'hoboken').length
    const edison = bookings.filter(b => b.office_location === 'edison').length

    // Time block breakdown
    const morning = bookings.filter(b => b.time_block === 'morning').length
    const afternoon = bookings.filter(b => b.time_block === 'afternoon').length
    const fullDay = bookings.filter(b => b.time_block === 'full_day').length

    // Top providers
    const providerCounts: Record<string, number> = {}
    bookings.forEach(b => {
      providerCounts[b.provider_name] = (providerCounts[b.provider_name] || 0) + 1
    })
    const topProviders = Object.entries(providerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Upcoming 7 days
    const next7 = new Date(now)
    next7.setDate(next7.getDate() + 7)
    const upcoming = bookings
      .filter(b => b.booking_date >= todayStr && b.booking_date <= next7.toISOString().split('T')[0])
      .sort((a, b) => a.booking_date.localeCompare(b.booking_date))
      .map(b => ({
        provider: b.provider_name,
        date: new Date(b.booking_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        location: b.office_location === 'hoboken' ? 'Hoboken' : 'Edison',
        timeBlock: b.time_block === 'morning' ? 'Morning' : b.time_block === 'afternoon' ? 'Afternoon' : 'Full Day',
      }))

    // Send via send-transactional-email
    const idempotencyKey = `exec-summary-${todayStr}`
    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'executive-summary',
        recipientEmail: RECIPIENT_EMAIL,
        idempotencyKey,
        templateData: {
          reportDate,
          totalBookings: bookings.length,
          hobokenBookings: hoboken,
          edisonBookings: edison,
          morningBlocks: morning,
          afternoonBlocks: afternoon,
          fullDayBlocks: fullDay,
          newBookingsToday: newToday,
          cancellationsToday: (cancelledToday || []).length,
          topProviders,
          upcomingBookings: upcoming,
        },
      },
    })

    if (error) {
      console.error('Failed to send executive summary:', error)
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true, queued: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Executive summary error:', err)
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
