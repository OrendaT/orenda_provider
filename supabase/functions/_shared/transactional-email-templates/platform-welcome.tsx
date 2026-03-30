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
const PLATFORM_URL = 'https://orenda-njoffice-guide.lovable.app'

interface PlatformWelcomeProps {
  providerName?: string
  loginEmail?: string
  loginPassword?: string
}

const PlatformWelcomeEmail = ({ providerName, loginEmail, loginPassword }: PlatformWelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to {SITE_NAME} — your hub for NJ in-person office days</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Orenda Psychiatry" width="140" height="auto" style={logoStyle} />

        <Section style={headerBanner}>
          <Text style={headerSubtitle}>WELCOME TO</Text>
          <Heading style={headerTitle}>{SITE_NAME}</Heading>
          <Text style={headerDate}>Your NJ In-Person Office Hub</Text>
        </Section>

        <Text style={greeting}>
          {providerName ? `Dear ${providerName},` : 'Dear Provider,'} welcome to the Orenda NJ In-Person Care Hub — your central platform for scheduling office time, accessing location details, and staying connected with the NJ Admin Team.
        </Text>

        {/* What You Can Do */}
        <Section style={detailsBox}>
          <Text style={sectionTitle}>What's on the Platform</Text>
          <Text style={featureItem}>
            <strong>Schedule Office Time</strong> — Book your in-person days at either the Hoboken or Edison office. Select your preferred date and time block (Morning, Afternoon, or Full Day).
          </Text>
          <Text style={featureItem}>
            <strong>Office Guides</strong> — Detailed location pages for both offices with directions, building access instructions, Wi-Fi info, after-hours procedures, and office amenities.
          </Text>
          <Text style={featureItem}>
            <strong>FAQs</strong> — Quick answers to common questions about building access, lockbox codes, patient check-in, swipe card setup, and more.
          </Text>
          <Text style={featureItem}>
            <strong>Patient Check-In</strong> — Patients text (201) 685-4863 upon arrival. You'll receive a notification when your patient has checked in.
          </Text>
        </Section>

        {/* Quick Start */}
        <Section style={infoCardWarm}>
          <Text style={infoCardTitleWarm}>Getting Started</Text>
          <Text style={infoCardText}>
            <strong>1.</strong> Visit the platform and explore the office guides for Hoboken and Edison.
          </Text>
          <Text style={infoCardText}>
            <strong>2.</strong> Schedule your first in-person office day — pick a date and time block that works for you.
          </Text>
          <Text style={infoCardText}>
            <strong>3.</strong> Coordinate swipe card and key access with the NJ Admin Team for seamless building entry.
          </Text>
          <Text style={infoCardText}>
            <strong>4.</strong> Your patient schedule will be circulated the evening before your office day.
          </Text>
        </Section>

        <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
          <Button style={primaryButton} href={PLATFORM_URL}>
            Visit the Platform →
          </Button>
        </Section>

        {loginEmail && loginPassword && (
          <Section style={credentialsBox}>
            <Text style={credentialsTitle}>Your Login Credentials</Text>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
              <tr>
                <td style={glanceLabelTd}>Email</td>
                <td style={glanceValueTd}>{loginEmail}</td>
              </tr>
              <tr>
                <td style={glanceLabelTd}>Temporary Password</td>
                <td style={glanceValueTd}>{loginPassword}</td>
              </tr>
            </table>
            <Text style={{ fontSize: '11px', color: '#8E9196', margin: '10px 0 0', lineHeight: '1.5' }}>
              Please change your password after your first login for security purposes.
            </Text>
          </Section>
        )}


        <Section style={infoCardGreen}>
          <Text style={infoCardTitleGreen}>Wi-Fi</Text>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <tr>
              <td style={glanceLabelTd}>Hoboken</td>
              <td style={glanceValueTd}>Network: Regus · Password: 167845630</td>
            </tr>
            <tr>
              <td style={glanceLabelTd}>Edison</td>
              <td style={glanceValueTd}>Network: Regus · Password: 167785439</td>
            </tr>
          </table>
        </Section>

        <Hr style={hr} />

        <Section style={contactSection}>
          <Text style={contactLabel}>NJ Admin Team</Text>
           <Text style={contactValue}>(201) 685-4863</Text>
           <Text style={contactValue}>offices@orendapsych.com</Text>
        </Section>

        <Text style={signoff}>
          We're here to support you every step of the way. Don't hesitate to reach out if you need anything!
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

export const template = {
  component: PlatformWelcomeEmail,
  subject: 'Welcome to the Orenda NJ In-Person Care Hub',
  displayName: 'Platform welcome',
  previewData: { providerName: 'Dr. Patricia McCabe', loginEmail: 'pmccabe@orendapsych.com', loginPassword: 'TempPass123!' },
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
const infoCardText = { fontSize: '13px', color: '#2d2d2d', lineHeight: '1.6', margin: '0 0 6px' }
const infoCardWarm = { backgroundColor: '#fff8f0', border: '1px solid #f0d4a8', borderRadius: '10px', padding: '16px 18px', margin: '0 0 16px' }
const infoCardTitleWarm = { fontSize: '13px', fontWeight: 'bold' as const, color: '#B06A2F', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardGreen = { backgroundColor: '#f0f7f4', border: '1px solid #c8e6d5', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitleGreen = { fontSize: '13px', fontWeight: 'bold' as const, color: '#2E7D4F', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const primaryButton = { backgroundColor: '#593D78', color: '#ffffff', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 600 as const, textDecoration: 'none', display: 'inline-block' as const }
const glanceLabelTd = { fontSize: '13px', color: '#8E9196', padding: '5px 12px 5px 0', verticalAlign: 'top' as const, width: '120px' }
const glanceValueTd = { fontSize: '13px', color: '#2d2d2d', padding: '5px 0', fontWeight: 600 as const }
const hr = { borderColor: '#e8e0f0', margin: '24px 0' }
const credentialsBox = { backgroundColor: '#fef9f0', border: '2px solid #e8c97a', borderRadius: '10px', padding: '16px 18px', margin: '0 0 16px' }
const credentialsTitle = { fontSize: '13px', fontWeight: 'bold' as const, color: '#8B6914', margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const contactSection = { backgroundColor: '#f4f1f9', borderRadius: '10px', padding: '14px 18px', margin: '0 0 20px' }
const contactLabel = { fontSize: '11px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const contactValue = { fontSize: '13px', color: '#2d2d2d', margin: '0 0 2px' }
const signoff = { fontSize: '15px', color: '#2d2d2d', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '13px', color: '#8E9196', margin: '20px 0 0', lineHeight: '1.6' }
