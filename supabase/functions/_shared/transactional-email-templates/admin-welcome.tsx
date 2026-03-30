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
const PLATFORM_URL = 'https://orenda-njoffice-guide.lovable.app'

interface AdminWelcomeProps {
  adminName?: string
}

const AdminWelcomeEmail = ({ adminName }: AdminWelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to the NJ Admin Team Portal — your operations command center</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Orenda Psychiatry" width="140" height="auto" style={logoStyle} />

        <Section style={headerBanner}>
          <Text style={headerSubtitle}>ADMIN TEAM</Text>
          <Heading style={headerTitle}>Welcome to the NJ Care Hub</Heading>
          <Text style={headerDate}>Your Internal Operations Portal</Text>
        </Section>

        <Text style={greeting}>
          {adminName ? `Hi ${adminName},` : 'Hi,'} welcome to the Orenda NJ In-Person Care Hub admin portal. As a member of the NJ Admin Team, you have full access to all management tools and operational features. Here's a complete overview of everything available to you.
        </Text>

        {/* Admin Console */}
        <Section style={detailsBox}>
          <Text style={sectionTitle}>Admin Console</Text>
          <Text style={featureItem}>
            <strong>Provider Directory</strong> — Create, manage, and disable provider accounts. Reset passwords, toggle admin access, export the roster to branded Excel, and manage phone numbers for SMS notifications.
          </Text>
          <Text style={featureItem}>
            <strong>Book (Office Scheduling)</strong> — Add providers to the calendar, manage office bookings, view and edit booking records with inline notes, track agreement signatures, and import CSV schedules with conflict detection.
          </Text>
          <Text style={featureItem}>
            <strong>Calendars</strong> — View all provider office schedules across Hoboken and Edison in a unified calendar view. Filter by location, provider, or date range.
          </Text>
          <Text style={featureItem}>
            <strong>Executive Reporting</strong> — Access utilization metrics, booking trends, provider activity summaries, and operational KPIs. Export reports to Excel with branded formatting.
          </Text>
          <Text style={featureItem}>
            <strong>Communication Hub</strong> — Send platform welcome emails, booking confirmations, and office agreement requests directly from the console. Preview all email templates before sending.
          </Text>
        </Section>

        {/* Provider-Facing Features */}
        <Section style={infoCard}>
          <Text style={infoCardTitle}>Provider-Facing Features You Manage</Text>
          <Text style={featureItem}>
            <strong>Office Booking Portal</strong> — Providers can self-schedule office time at Hoboken or Edison, choosing their preferred date and time block (Morning, Afternoon, or Full Day).
          </Text>
          <Text style={featureItem}>
            <strong>Office Guides</strong> — Detailed location pages with directions, building access, Wi-Fi credentials, lockbox codes, after-hours procedures, and amenities.
          </Text>
          <Text style={featureItem}>
            <strong>Office Agreement</strong> — Digital signature workflow for the Provider Office Use Agreement & Scheduling Policy. Providers sign online and receive a confirmation copy.
          </Text>
          <Text style={featureItem}>
            <strong>FAQs</strong> — Self-service answers to common provider questions about building access, check-in, swipe cards, and office procedures.
          </Text>
        </Section>

        {/* Automated Workflows */}
        <Section style={infoCardWarm}>
          <Text style={infoCardTitleWarm}>Automated Workflows</Text>
          <Text style={featureItem}>
            <strong>Booking Confirmation Emails</strong> — Sent automatically to providers when they book office time. Includes directions, Wi-Fi, lockbox code, and check-in instructions specific to each location.
          </Text>
          <Text style={featureItem}>
            <strong>Agreement Request Emails</strong> — Triggered when an admin adds a provider to the calendar, prompting them to sign the office agreement before their visit.
          </Text>
          <Text style={featureItem}>
            <strong>Agreement Signed Confirmation</strong> — Sent to both the provider and the admin team when an agreement is signed, serving as a receipt and audit trail.
          </Text>
          <Text style={featureItem}>
            <strong>Patient Check-In Notifications</strong> — Patients text (201) 685-4863 upon arrival. Providers receive a notification when their patient has checked in.
          </Text>
          <Text style={featureItem}>
            <strong>Daily Executive Summary</strong> — An automated daily recap of bookings, utilization, and operational metrics delivered to the admin team.
          </Text>
        </Section>

        {/* Quick Links */}
        <Section style={infoCardGreen}>
          <Text style={infoCardTitleGreen}>Key Contacts & Info</Text>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <tr>
              <td style={glanceLabelTd}>NJ Admin</td>
              <td style={glanceValueTd}>(201) 685-4863 · offices@orendapsych.com</td>
            </tr>
            <tr>
              <td style={glanceLabelTd}>Hoboken Wi-Fi</td>
              <td style={glanceValueTd}>Regus Net Wi-Fi · 167845630</td>
            </tr>
            <tr>
              <td style={glanceLabelTd}>Edison Wi-Fi</td>
              <td style={glanceValueTd}>Regus · 167785439</td>
            </tr>
            <tr>
              <td style={glanceLabelTd}>Lockbox Code</td>
              <td style={glanceValueTd}>0000</td>
            </tr>
          </table>
        </Section>

        <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
          <Button style={primaryButton} href={`${PLATFORM_URL}/admin-v2`}>
            Open Admin Console
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Warm regards,<br />
          <strong>The New Jersey Admin Team</strong><br />
          201-685-4863 · offices@orendapsych.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminWelcomeEmail,
  subject: 'Welcome to the NJ Admin Portal — Your Operations Command Center',
  displayName: 'Admin team welcome',
  previewData: { adminName: 'Susie' },
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
const featureItem = { fontSize: '13px', color: '#2d2d2d', lineHeight: '1.7', margin: '0 0 12px' }
const infoCard = { backgroundColor: '#f9f7fc', border: '1px solid #e8e0f0', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitle = { fontSize: '13px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardWarm = { backgroundColor: '#fff8f0', border: '1px solid #f0d4a8', borderRadius: '10px', padding: '16px 18px', margin: '0 0 16px' }
const infoCardTitleWarm = { fontSize: '13px', fontWeight: 'bold' as const, color: '#B06A2F', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardGreen = { backgroundColor: '#f0f7f4', border: '1px solid #c8e6d5', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitleGreen = { fontSize: '13px', fontWeight: 'bold' as const, color: '#2E7D4F', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const glanceLabelTd = { fontSize: '13px', color: '#8E9196', padding: '5px 12px 5px 0', verticalAlign: 'top' as const, width: '120px' }
const glanceValueTd = { fontSize: '13px', color: '#2d2d2d', padding: '5px 0', fontWeight: 600 as const }
const primaryButton = { backgroundColor: '#593D78', color: '#ffffff', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 600 as const, textDecoration: 'none', display: 'inline-block' as const }
const hr = { borderColor: '#e8e0f0', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#8E9196', margin: '20px 0 0', lineHeight: '1.6' }
