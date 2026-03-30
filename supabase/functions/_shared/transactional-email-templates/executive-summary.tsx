/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
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

interface ExecutiveSummaryProps {
  reportDate?: string
  totalBookings?: number
  hobokenBookings?: number
  edisonBookings?: number
  morningBlocks?: number
  afternoonBlocks?: number
  fullDayBlocks?: number
  upcomingBookings?: { provider: string; date: string; location: string; timeBlock: string }[]
  topProviders?: { name: string; count: number }[]
  newBookingsToday?: number
  cancellationsToday?: number
}

const ExecutiveSummaryEmail = ({
  reportDate,
  totalBookings = 0,
  hobokenBookings = 0,
  edisonBookings = 0,
  morningBlocks = 0,
  afternoonBlocks = 0,
  fullDayBlocks = 0,
  upcomingBookings = [],
  topProviders = [],
  newBookingsToday = 0,
  cancellationsToday = 0,
}: ExecutiveSummaryProps) => {
  const dateLabel = reportDate || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>NJ Office Daily Summary — {dateLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={LOGO_URL} alt="Orenda Psychiatry" width="140" height="auto" style={logoStyle} />

          <Section style={headerBanner}>
            <Text style={headerSubtitle}>DAILY EXECUTIVE SUMMARY</Text>
            <Heading style={headerTitle}>NJ Office Operations</Heading>
            <Text style={headerDate}>{dateLabel}</Text>
          </Section>

          {/* Today's Activity */}
          <Section style={detailsBox}>
            <Text style={sectionTitle}>Today's Activity</Text>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
              <tr>
                <td style={statCard}>
                  <Text style={statNumber}>{newBookingsToday}</Text>
                  <Text style={statLabel}>New Bookings</Text>
                </td>
                <td style={{ width: '12px' }}></td>
                <td style={statCard}>
                  <Text style={statNumber}>{cancellationsToday}</Text>
                  <Text style={statLabel}>Cancellations</Text>
                </td>
                <td style={{ width: '12px' }}></td>
                <td style={statCard}>
                  <Text style={statNumber}>{totalBookings}</Text>
                  <Text style={statLabel}>Total Active</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Location Breakdown */}
          <Section style={infoCard}>
            <Text style={infoCardTitle}>Location Distribution</Text>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
              <tr>
                <td style={locationBarLabel}>Hoboken</td>
                <td style={locationBarValue}>
                  <div style={{ ...locationBar, width: totalBookings > 0 ? `${Math.max((hobokenBookings / totalBookings) * 100, 8)}%` : '8%' }}></div>
                </td>
                <td style={locationBarCount}>{hobokenBookings}</td>
              </tr>
              <tr>
                <td style={locationBarLabel}>Edison</td>
                <td style={locationBarValue}>
                  <div style={{ ...locationBarEdison, width: totalBookings > 0 ? `${Math.max((edisonBookings / totalBookings) * 100, 8)}%` : '8%' }}></div>
                </td>
                <td style={locationBarCount}>{edisonBookings}</td>
              </tr>
            </table>
          </Section>

          {/* Time Block Breakdown */}
          <Section style={infoCardGreen}>
            <Text style={infoCardTitleGreen}>Time Block Distribution</Text>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
              <tr>
                <td style={detailLabelTd}>Morning</td>
                <td style={detailValueTd}>{morningBlocks} booking{morningBlocks !== 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td style={detailLabelTd}>Afternoon</td>
                <td style={detailValueTd}>{afternoonBlocks} booking{afternoonBlocks !== 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td style={detailLabelTd}>Full Day</td>
                <td style={detailValueTd}>{fullDayBlocks} booking{fullDayBlocks !== 1 ? 's' : ''}</td>
              </tr>
            </table>
          </Section>

          {/* Top Providers */}
          {topProviders.length > 0 && (
            <Section style={infoCardWarm}>
              <Text style={infoCardTitleWarm}>Most Active Providers</Text>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                {topProviders.slice(0, 5).map((p, i) => (
                  <tr key={i}>
                    <td style={rankTd}>{i + 1}.</td>
                    <td style={providerNameTd}>{p.name}</td>
                    <td style={providerCountTd}>{p.count} booking{p.count !== 1 ? 's' : ''}</td>
                  </tr>
                ))}
              </table>
            </Section>
          )}

          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <Section style={infoCard}>
              <Text style={infoCardTitle}>Upcoming (Next 7 Days)</Text>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <tr>
                  <td style={tableHeaderTd}>Provider</td>
                  <td style={tableHeaderTd}>Date</td>
                  <td style={tableHeaderTd}>Location</td>
                  <td style={tableHeaderTd}>Time</td>
                </tr>
                {upcomingBookings.slice(0, 10).map((b, i) => (
                  <tr key={i}>
                    <td style={tableCellTd}>{b.provider}</td>
                    <td style={tableCellTd}>{b.date}</td>
                    <td style={tableCellTd}>{b.location}</td>
                    <td style={tableCellTd}>{b.timeBlock}</td>
                  </tr>
                ))}
              </table>
              {upcomingBookings.length > 10 && (
                <Text style={moreText}>+ {upcomingBookings.length - 10} more bookings</Text>
              )}
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footerText}>
            This is an automated daily summary from the Orenda NJ In-Person Care Hub. For questions or changes, contact the NJ Admin Team.
          </Text>

          <Text style={footer}>
            <strong>The New Jersey Admin Team</strong><br />
            201-685-4863 · offices@orendapsych.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ExecutiveSummaryEmail,
  subject: (data: Record<string, any>) => `NJ Office Daily Summary — ${data.reportDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
  displayName: 'Executive daily summary',
  previewData: {
    reportDate: 'Monday, March 23, 2026',
    totalBookings: 24,
    hobokenBookings: 15,
    edisonBookings: 9,
    morningBlocks: 10,
    afternoonBlocks: 8,
    fullDayBlocks: 6,
    newBookingsToday: 3,
    cancellationsToday: 1,
    topProviders: [
      { name: 'Dr. Patricia McCabe', count: 5 },
      { name: 'Dr. Michael Sanya', count: 4 },
      { name: 'Galina Grapp', count: 3 },
    ],
    upcomingBookings: [
      { provider: 'Dr. Patricia McCabe', date: 'Mar 24', location: 'Hoboken', timeBlock: 'Morning' },
      { provider: 'Dr. Michael Sanya', date: 'Mar 25', location: 'Edison', timeBlock: 'Full Day' },
      { provider: 'Galina Grapp', date: 'Mar 26', location: 'Hoboken', timeBlock: 'Afternoon' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "Georgia, 'Times New Roman', serif" }
const container = { padding: '30px 25px', maxWidth: '600px' }
const logoStyle = { margin: '0 0 24px' }
const headerBanner = { backgroundColor: '#593D78', borderRadius: '12px', padding: '28px 24px', textAlign: 'center' as const, margin: '0 0 24px' }
const headerSubtitle = { fontSize: '11px', color: '#d4c5e6', textTransform: 'uppercase' as const, letterSpacing: '2px', margin: '0 0 6px', fontWeight: 600 as const }
const headerTitle = { fontSize: '24px', fontWeight: 'bold' as const, color: '#ffffff', margin: '0 0 6px' }
const headerDate = { fontSize: '15px', color: '#ffffff', margin: '0' }
const detailsBox = { backgroundColor: '#f9f7fc', borderRadius: '12px', padding: '20px', margin: '0 0 16px', borderLeft: '4px solid #593D78' }
const sectionTitle = { fontSize: '14px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 14px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const statCard = { backgroundColor: '#ffffff', border: '1px solid #e8e0f0', borderRadius: '10px', padding: '14px', textAlign: 'center' as const, verticalAlign: 'top' as const }
const statNumber = { fontSize: '28px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 2px' }
const statLabel = { fontSize: '11px', color: '#8E9196', margin: '0', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCard = { backgroundColor: '#f9f7fc', border: '1px solid #e8e0f0', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitle = { fontSize: '13px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardGreen = { backgroundColor: '#f0f7f4', border: '1px solid #c8e6d5', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitleGreen = { fontSize: '13px', fontWeight: 'bold' as const, color: '#2E7D4F', margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardWarm = { backgroundColor: '#fff8f0', border: '1px solid #f0d4a8', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitleWarm = { fontSize: '13px', fontWeight: 'bold' as const, color: '#B06A2F', margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailLabelTd = { fontSize: '13px', color: '#8E9196', padding: '5px 12px 5px 0', verticalAlign: 'top' as const, width: '100px' }
const detailValueTd = { fontSize: '13px', color: '#2d2d2d', padding: '5px 0', fontWeight: 600 as const }
const locationBarLabel = { fontSize: '13px', color: '#2d2d2d', padding: '6px 10px 6px 0', width: '80px', fontWeight: 600 as const }
const locationBarValue = { padding: '6px 0', verticalAlign: 'middle' as const }
const locationBar = { backgroundColor: '#593D78', height: '18px', borderRadius: '4px', display: 'inline-block' as const, minWidth: '20px' }
const locationBarEdison = { backgroundColor: '#B06A2F', height: '18px', borderRadius: '4px', display: 'inline-block' as const, minWidth: '20px' }
const locationBarCount = { fontSize: '13px', fontWeight: 'bold' as const, color: '#2d2d2d', padding: '6px 0 6px 10px', width: '40px', textAlign: 'right' as const }
const rankTd = { fontSize: '13px', color: '#8E9196', padding: '4px 6px 4px 0', width: '24px' }
const providerNameTd = { fontSize: '13px', color: '#2d2d2d', padding: '4px 0', fontWeight: 600 as const }
const providerCountTd = { fontSize: '12px', color: '#8E9196', padding: '4px 0 4px 10px', textAlign: 'right' as const }
const tableHeaderTd = { fontSize: '11px', color: '#8E9196', padding: '6px 8px 6px 0', borderBottom: '1px solid #e8e0f0', textTransform: 'uppercase' as const, letterSpacing: '0.5px', fontWeight: 600 as const }
const tableCellTd = { fontSize: '12px', color: '#2d2d2d', padding: '6px 8px 6px 0', borderBottom: '1px solid #f0ecf5' }
const moreText = { fontSize: '12px', color: '#8E9196', margin: '8px 0 0', fontStyle: 'italic' as const }
const hr = { borderColor: '#e8e0f0', margin: '24px 0' }
const footerText = { fontSize: '12px', color: '#8E9196', lineHeight: '1.6', margin: '0 0 12px' }
const footer = { fontSize: '13px', color: '#8E9196', margin: '0', lineHeight: '1.6' }
