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

interface AgreementSignedProps {
  providerName?: string
  providerEmail?: string
  signedDate?: string
}

const AgreementSignedEmail = ({ providerName, providerEmail, signedDate }: AgreementSignedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Office Use Agreement signed — {providerName || 'Provider'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Orenda Psychiatry" width="140" height="auto" style={logoStyle} />

        <Section style={headerBanner}>
          <Text style={headerSubtitle}>AGREEMENT SIGNED</Text>
          <Heading style={headerTitle}>Office Use Agreement</Heading>
          <Text style={headerDate}>Confirmation of Signature</Text>
        </Section>

        <Text style={greeting}>
          {providerName ? `Dear ${providerName},` : 'Dear Provider,'} this email confirms that you have successfully reviewed and signed the Provider Office Use Agreement & Scheduling Policy.
        </Text>

        <Section style={detailsBox}>
          <Text style={sectionTitle}>Signature Details</Text>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <tr>
              <td style={detailLabelTd}>Provider</td>
              <td style={detailValueTd}>{providerName || 'N/A'}</td>
            </tr>
            <tr>
              <td style={detailLabelTd}>Email</td>
              <td style={detailValueTd}>{providerEmail || 'N/A'}</td>
            </tr>
            <tr>
              <td style={detailLabelTd}>Date Signed</td>
              <td style={detailValueTd}>{signedDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </Section>

        <Section style={infoCard}>
          <Text style={infoCardTitle}>Agreement Highlights</Text>
          <Text style={infoCardText}><strong>Building Access:</strong> Follow all security procedures; do not share keys or lockbox codes.</Text>
          <Text style={infoCardText}><strong>Office Reset:</strong> Leave the office clean and organized for the next provider.</Text>
          <Text style={infoCardText}><strong>Cancellation Policy:</strong> Provide at least 48 hours notice for schedule changes.</Text>
          <Text style={infoCardText}><strong>Swipe Card:</strong> Contact the NJ Admin Team to set up a permanent swipe card for after-hours access.</Text>
        </Section>

        <Text style={noteText}>
          Please retain this email for your records. If you have any questions about the agreement, contact the NJ Admin Team.
        </Text>

        <Hr style={hr} />

        <Section style={contactSection}>
          <Text style={contactLabel}>NJ Admin Team</Text>
          <Text style={contactValue}>(201) 685-4863</Text>
          <Text style={contactValue}>offices@orendapsych.com</Text>
        </Section>

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
  component: AgreementSignedEmail,
  subject: 'Office Use Agreement — Signed Confirmation',
  displayName: 'Agreement signed confirmation',
  previewData: {
    providerName: 'Dr. Patricia McCabe',
    providerEmail: 'patricia@orendapsych.com',
    signedDate: 'March 22, 2026',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "Georgia, 'Times New Roman', serif" }
const container = { padding: '30px 25px', maxWidth: '600px' }
const logoStyle = { margin: '0 0 24px' }
const headerBanner = { backgroundColor: '#593D78', borderRadius: '12px', padding: '28px 24px', textAlign: 'center' as const, margin: '0 0 24px' }
const headerSubtitle = { fontSize: '11px', color: '#c8e6d5', textTransform: 'uppercase' as const, letterSpacing: '2px', margin: '0 0 6px', fontWeight: 600 as const }
const headerTitle = { fontSize: '24px', fontWeight: 'bold' as const, color: '#ffffff', margin: '0 0 6px' }
const headerDate = { fontSize: '15px', color: '#ffffff', margin: '0' }
const greeting = { fontSize: '15px', color: '#2d2d2d', lineHeight: '1.7', margin: '0 0 24px' }
const detailsBox = { backgroundColor: '#f9f7fc', borderRadius: '12px', padding: '20px', margin: '0 0 16px', borderLeft: '4px solid #593D78' }
const sectionTitle = { fontSize: '14px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailLabelTd = { fontSize: '13px', color: '#8E9196', padding: '4px 12px 4px 0', verticalAlign: 'top' as const, width: '100px' }
const detailValueTd = { fontSize: '14px', color: '#2d2d2d', padding: '4px 0', fontWeight: 600 as const }
const infoCard = { backgroundColor: '#f9f7fc', border: '1px solid #e8e0f0', borderRadius: '10px', padding: '16px 18px', margin: '0 0 12px' }
const infoCardTitle = { fontSize: '13px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardText = { fontSize: '13px', color: '#2d2d2d', lineHeight: '1.6', margin: '0 0 6px' }
const noteText = { fontSize: '13px', color: '#8E9196', lineHeight: '1.6', margin: '0 0 16px', fontStyle: 'italic' as const }
const hr = { borderColor: '#e8e0f0', margin: '24px 0' }
const contactSection = { backgroundColor: '#f4f1f9', borderRadius: '10px', padding: '14px 18px', margin: '0 0 20px' }
const contactLabel = { fontSize: '11px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const contactValue = { fontSize: '13px', color: '#2d2d2d', margin: '0 0 2px' }
const footer = { fontSize: '13px', color: '#8E9196', margin: '20px 0 0', lineHeight: '1.6' }
