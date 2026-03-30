/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Hr,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const LOGO_URL = 'https://dcankgdsjpuptevchncx.supabase.co/storage/v1/object/public/email-assets/orenda-logo-purple.png'
const SITE_NAME = 'Orenda NJ Care Hub'

interface BookingConfirmationProps {
  providerName?: string
  bookingDate?: string
  timeBlock?: string
  location?: string
}

const locationInfo: Record<string, { address: string; city: string; phone: string; regusEmail: string; afterHours: string; wifiNetwork: string; wifiPassword: string; directions: string; landmark: string; parking: string; lockboxCode: string; footerAddress: string }> = {
  hoboken: {
    address: '221 River St, 9th Floor, Unit 9076',
    city: 'Hoboken, NJ 07030',
    phone: '(201) 484-7855',
    regusEmail: 'Hoboken.RiverSt@regus.com',
    afterHours: 'After 5 PM: Place the QR code check-in sign by the 9th-floor glass door and personally greet your patients at the entrance.',
    wifiNetwork: 'Regus Net Wi-Fi',
    wifiPassword: '167845630',
    directions: 'Enter the building lobby at 221 River Street (next to Wonder Cafe), take elevators to the 9th floor. Regus reception is straight ahead.',
    landmark: 'Look for Wonder Cafe — the building entrance is directly next to it.',
    parking: 'Street parking and nearby garages available. NJ Transit Hoboken Terminal is a short walk away.',
    lockboxCode: '0000',
    footerAddress: '221 River Street, 9th Floor, Hoboken, NJ 07030',
  },
  edison: {
    address: '110 Fieldcrest Ave, 3rd Floor, Unit 328',
    city: 'Edison, NJ 08837',
    phone: '(732) 782-0328',
    regusEmail: 'Edison.Fieldcrest@regus.com',
    afterHours: 'Both providers and patients must use the P1 Parking Level entrance, the entrance is around the back of the building. Access code: 05296.',
    wifiNetwork: 'Regus',
    wifiPassword: '167785439',
    directions: 'Enter through the main entrance during business hours (Mon–Fri, 8 AM – 6 PM). Take the elevator to the 3rd floor.',
    landmark: 'Located near major highways with easy access from Route 287 and the NJ Turnpike.',
    parking: 'Free parking available on-site.',
    lockboxCode: '0000',
    footerAddress: '110 Fieldcrest Avenue, 3rd Floor, Edison, NJ 08837',
  },
}

const BookingConfirmationEmail = ({
  providerName,
  bookingDate,
  timeBlock,
  location,
}: BookingConfirmationProps) => {
  const loc = locationInfo[(location || 'hoboken').toLowerCase()] || locationInfo.hoboken
  const locationLabel = (location || 'Hoboken').charAt(0).toUpperCase() + (location || 'hoboken').slice(1)

  const timeLabel = timeBlock === 'morning' ? 'Morning (9 AM – 3 PM)'
    : timeBlock === 'afternoon' ? 'Afternoon (3 PM – 9 PM)'
    : timeBlock === 'full_day' ? 'Full Day (9 AM – 9 PM)'
    : timeBlock || 'TBD'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your office booking at {locationLabel} is confirmed — {bookingDate || 'upcoming date'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={LOGO_URL} alt="Orenda Psychiatry" width="140" height="auto" style={logoStyle} />

          <Section style={headerBanner}>
            <Text style={headerSubtitle}>BOOKING CONFIRMED</Text>
            <Heading style={headerTitle}>{locationLabel} Office</Heading>
            <Text style={headerDate}>{bookingDate || 'TBD'} · {timeLabel}</Text>
          </Section>

          <Text style={greeting}>
            Dear {providerName || 'Provider'}, thank you for booking your in-person office day. Here's everything you need for a smooth visit.
          </Text>

          {/* Booking Details */}
          <Section style={detailsBox}>
            <Text style={sectionTitle}>Booking Details</Text>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
              <tr>
                <td style={detailLabelTd}>Date</td>
                <td style={detailValueTd}>{bookingDate || 'TBD'}</td>
              </tr>
              <tr>
                <td style={detailLabelTd}>Time Block</td>
                <td style={detailValueTd}>{timeLabel}</td>
              </tr>
              <tr>
                <td style={detailLabelTd}>Location</td>
                <td style={detailValueTd}>{locationLabel} Office</td>
              </tr>
              <tr>
                <td style={detailLabelTd}>Address</td>
                <td style={detailValueTd}>{loc.address}, {loc.city}</td>
              </tr>
            </table>
          </Section>

          {/* Directions */}
          <Section style={infoCard}>
            <Text style={infoCardTitle}>Getting There</Text>
            <Text style={infoCardText}>{loc.directions}</Text>
            <Text style={infoCardText}><strong>Landmark:</strong> {loc.landmark}</Text>
            <Text style={infoCardText}><strong>Parking:</strong> {loc.parking}</Text>
          </Section>

          {/* Office Access */}
          <Section style={infoCardWarm}>
            <Text style={infoCardTitleWarm}>Office Access</Text>
            <Text style={infoCardText}>
              <strong>Regus Office Hours:</strong> Mon–Fri, 9:00 AM – 5:00 PM
            </Text>
            <Text style={infoCardText}>
              During Regus hours, access the office key and swipe card from the lockbox outside the Orenda office door. <strong>Lockbox code: {loc.lockboxCode}</strong>. Please return both items when finished.
            </Text>
            <Text style={infoCardText}>
              <strong>Tip:</strong> An additional swipe card is available inside the office — check the desk drawers if you need a backup during your visit.
            </Text>
            <Text style={infoCardTextBold}>
              If attending the office outside of Regus hours, make sure you are set up with a permanent swipe card. You can coordinate this through the NJ Admin Team.
            </Text>
            <Button style={emailButton} href="mailto:offices@orendapsych.com?subject=Swipe%20Card%20Setup%20Request&body=Hi%20NJ%20Admin%20Team%2C%0A%0AI%20would%20like%20to%20be%20set%20up%20with%20a%20permanent%20swipe%20card%20for%20after-hours%20access.%0A%0AThank%20you!">
              Email NJ Admin for Swipe Card Setup
            </Button>
          </Section>

          {/* Patient Check-In Sign */}
           <Section style={infoCard}>
            <Text style={infoCardTitle}>Patient Check-In</Text>
            <Text style={infoCardText}>
              <strong>Outside of Regus office hours:</strong> Please place the <strong>Orenda Patient Welcome & Check-In sign</strong> by the entrance so that patients can text the NJ team upon arrival.
            </Text>
            <Text style={infoCardText}>You'll receive a notification when your patient has checked in.</Text>
            <Text style={infoCardText}>Patient schedules will be circulated by the NJ admin team the night before.</Text>
          </Section>

          {/* Wi-Fi */}
          <Section style={infoCardGreen}>
            <Text style={infoCardTitleGreen}>Wi-Fi &amp; Amenities</Text>
            <Text style={infoCardText}><strong>Network:</strong> {loc.wifiNetwork}</Text>
            <Text style={infoCardText}><strong>Password:</strong> {loc.wifiPassword}</Text>
            <Text style={infoCardText}><strong>Amenities:</strong> Patient seating, weight scale, blood pressure cuff</Text>
          </Section>

          <Hr style={hr} />

          {/* Contacts */}
          <Section style={contactsRow}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
              <tr>
                <td style={contactBox}>
                   <Text style={contactLabel}>Orenda NJ Admin</Text>
                   <Text style={contactValue}>(201) 685-4863</Text>
                   <Text style={contactValue}>offices@orendapsych.com</Text>
                 </td>
                 <td style={{ width: '16px' }}></td>
                <td style={contactBoxAlt}>
                  <Text style={contactLabelAlt}>Regus {locationLabel}</Text>
                   <Text style={contactValue}>{loc.phone}</Text>
                   <Text style={contactValue}>{loc.regusEmail}</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Text style={signoff}>
            We look forward to seeing you at the {locationLabel} office!
          </Text>

          <Text style={footer}>
            Warm regards,<br />
            <strong>The New Jersey Admin Team</strong><br />
            201-685-4863 · offices@orendapsych.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: BookingConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `Booking Confirmed — ${(data.location || 'Office').charAt(0).toUpperCase() + (data.location || 'Office').slice(1)} · ${data.bookingDate || 'Upcoming'}`,
  displayName: 'Booking confirmation',
  previewData: {
    providerName: 'Dr. Patricia McCabe',
    bookingDate: 'April 2, 2026',
    timeBlock: 'afternoon',
    location: 'hoboken',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "Georgia, 'Times New Roman', serif" }
const container = { padding: '30px 25px', maxWidth: '600px' }
const logoStyle = { margin: '0 0 24px' }
const headerBanner = { backgroundColor: '#593D78', borderRadius: '12px', padding: '28px 24px', textAlign: 'center' as const, margin: '0 0 24px' }
const headerSubtitle = { fontSize: '11px', color: '#d4c5e6', textTransform: 'uppercase' as const, letterSpacing: '2px', margin: '0 0 6px', fontWeight: 600 as const }
const headerTitle = { fontSize: '24px', fontWeight: 'bold' as const, color: '#ffffff', margin: '0 0 6px' }
const headerDate = { fontSize: '15px', color: '#ffffff', margin: '0' }
const greeting = { fontSize: '15px', color: '#2d2d2d', lineHeight: '1.7', margin: '0 0 24px' }
const detailsBox = { backgroundColor: '#f9f7fc', borderRadius: '12px', padding: '20px', margin: '0 0 16px', borderLeft: '4px solid #593D78' }
const sectionTitle = { fontSize: '14px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailLabelTd = { fontSize: '13px', color: '#8E9196', padding: '4px 12px 4px 0', verticalAlign: 'top' as const, width: '100px' }
const detailValueTd = { fontSize: '14px', color: '#2d2d2d', padding: '4px 0', fontWeight: 600 as const }
const hr = { borderColor: '#e8e0f0', margin: '24px 0' }
const infoCard = { backgroundColor: '#f9f7fc', border: '1px solid #e8e0f0', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitle = { fontSize: '13px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardText = { fontSize: '13px', color: '#2d2d2d', lineHeight: '1.6', margin: '0 0 6px' }
const infoCardTextBold = { fontSize: '13px', color: '#B06A2F', lineHeight: '1.6', margin: '6px 0 10px', fontWeight: 600 as const }
const infoCardWarm = { backgroundColor: '#fff8f0', border: '1px solid #f0d4a8', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitleWarm = { fontSize: '13px', fontWeight: 'bold' as const, color: '#B06A2F', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardGreen = { backgroundColor: '#f0f7f4', border: '1px solid #c8e6d5', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitleGreen = { fontSize: '13px', fontWeight: 'bold' as const, color: '#2E7D4F', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const emailButton = { backgroundColor: '#593D78', color: '#ffffff', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600 as const, textDecoration: 'none', display: 'inline-block' as const, margin: '4px 0 0' }
const contactsRow = { margin: '0 0 20px' }
const contactBox = { backgroundColor: '#f4f1f9', borderRadius: '10px', padding: '14px', verticalAlign: 'top' as const }
const contactBoxAlt = { backgroundColor: '#faf9f5', borderRadius: '10px', padding: '14px', verticalAlign: 'top' as const }
const contactLabel = { fontSize: '11px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const contactLabelAlt = { fontSize: '11px', fontWeight: 'bold' as const, color: '#8B7335', margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const contactValue = { fontSize: '13px', color: '#2d2d2d', margin: '0 0 2px' }
const signoff = { fontSize: '15px', color: '#2d2d2d', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '13px', color: '#8E9196', margin: '20px 0 0', lineHeight: '1.6' }
