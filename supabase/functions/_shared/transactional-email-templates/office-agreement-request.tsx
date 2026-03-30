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
const AGREEMENT_URL = 'https://orenda-njoffice-guide.lovable.app/nj-office/office-addendum'

interface OfficeAgreementRequestProps {
  providerName?: string
  officeDate?: string
  location?: string
  startTime?: string
  endTime?: string
}

const OfficeAgreementRequestEmail = ({
  providerName,
  officeDate,
  location,
  startTime,
  endTime,
}: OfficeAgreementRequestProps) => {
  const locationLabel = location
    ? location.charAt(0).toUpperCase() + location.slice(1)
    : 'the NJ office'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Office agreement required before your upcoming visit — {locationLabel}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={LOGO_URL} alt="Orenda Psychiatry" width="140" height="auto" style={logoStyle} />

          <Section style={headerBanner}>
            <Text style={headerSubtitle}>ACTION REQUIRED</Text>
            <Heading style={headerTitle}>Office Use Agreement</Heading>
            <Text style={headerDate}>Please sign before your visit</Text>
          </Section>

          <Text style={greeting}>
            Dear {providerName || 'Provider'}, you've been scheduled for an in-person office day at our {locationLabel} location. Before your visit, please review and sign the Office Use Agreement.
          </Text>

          {officeDate && (
            <Section style={detailsBox}>
              <Text style={sectionTitle}>Your Upcoming Office Day</Text>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <tr>
                  <td style={detailLabelTd}>Date</td>
                  <td style={detailValueTd}>{officeDate}</td>
                </tr>
                <tr>
                  <td style={detailLabelTd}>Location</td>
                  <td style={detailValueTd}>{locationLabel}</td>
                </tr>
                {startTime && endTime && (
                  <tr>
                    <td style={detailLabelTd}>Time</td>
                    <td style={detailValueTd}>{startTime} – {endTime}</td>
                  </tr>
                )}
              </table>
            </Section>
          )}

          <Section style={infoCardWarm}>
            <Text style={infoCardTitleWarm}>Why This Is Required</Text>
            <Text style={infoCardText}>
              The Office Use Agreement outlines the shared workspace guidelines, including access protocols, swipe card policies, and the 48-hour cancellation policy. All providers must sign prior to their first office visit.
            </Text>
          </Section>

          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button style={primaryButton} href={AGREEMENT_URL}>
              Review &amp; Sign the Agreement
            </Button>
          </Section>

          <Text style={noteText}>
            If you've already signed the agreement, no further action is needed — you can disregard this email.
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
}

export const template = {
  component: OfficeAgreementRequestEmail,
  subject: (data: Record<string, any>) =>
    `Action Required: Sign the Office Use Agreement — ${data.location ? data.location.charAt(0).toUpperCase() + data.location.slice(1) : 'NJ Office'}`,
  displayName: 'Office agreement request',
  previewData: {
    providerName: 'Dr. Patricia McCabe',
    officeDate: 'April 2, 2026',
    location: 'hoboken',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "Georgia, 'Times New Roman', serif" }
const container = { padding: '30px 25px', maxWidth: '600px' }
const logoStyle = { margin: '0 0 24px' }
const headerBanner = { backgroundColor: '#593D78', borderRadius: '12px', padding: '28px 24px', textAlign: 'center' as const, margin: '0 0 24px' }
const headerSubtitle = { fontSize: '11px', color: '#f0d4a8', textTransform: 'uppercase' as const, letterSpacing: '2px', margin: '0 0 6px', fontWeight: 600 as const }
const headerTitle = { fontSize: '24px', fontWeight: 'bold' as const, color: '#ffffff', margin: '0 0 6px' }
const headerDate = { fontSize: '15px', color: '#ffffff', margin: '0' }
const greeting = { fontSize: '15px', color: '#2d2d2d', lineHeight: '1.7', margin: '0 0 24px' }
const detailsBox = { backgroundColor: '#f9f7fc', borderRadius: '12px', padding: '20px', margin: '0 0 16px', borderLeft: '4px solid #593D78' }
const sectionTitle = { fontSize: '14px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailLabelTd = { fontSize: '13px', color: '#8E9196', padding: '4px 12px 4px 0', verticalAlign: 'top' as const, width: '100px' }
const detailValueTd = { fontSize: '14px', color: '#2d2d2d', padding: '4px 0', fontWeight: 600 as const }
const infoCardWarm = { backgroundColor: '#fff8f0', border: '1px solid #f0d4a8', borderRadius: '10px', padding: '16px 18px', margin: '0 0 16px' }
const infoCardTitleWarm = { fontSize: '13px', fontWeight: 'bold' as const, color: '#B06A2F', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const infoCardText = { fontSize: '13px', color: '#2d2d2d', lineHeight: '1.6', margin: '0 0 6px' }
const primaryButton = { backgroundColor: '#593D78', color: '#ffffff', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 600 as const, textDecoration: 'none', display: 'inline-block' as const }
const noteText = { fontSize: '13px', color: '#8E9196', lineHeight: '1.6', margin: '0 0 16px', fontStyle: 'italic' as const }
const hr = { borderColor: '#e8e0f0', margin: '24px 0' }
const contactSection = { backgroundColor: '#f4f1f9', borderRadius: '10px', padding: '14px 18px', margin: '0 0 20px' }
const contactLabel = { fontSize: '11px', fontWeight: 'bold' as const, color: '#593D78', margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const contactValue = { fontSize: '13px', color: '#2d2d2d', margin: '0 0 2px' }
const footer = { fontSize: '13px', color: '#8E9196', margin: '20px 0 0', lineHeight: '1.6' }
