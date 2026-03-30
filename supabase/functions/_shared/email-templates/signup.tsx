/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

const LOGO_URL = 'https://dcankgdsjpuptevchncx.supabase.co/storage/v1/object/public/email-assets/orenda-logo-purple.png'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for Orenda NJ Care Hub</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Orenda Psychiatry" width="140" height="auto" style={logo} />
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thanks for joining the{' '}
          <Link href={siteUrl} style={link}>
            <strong>Orenda NJ Care Hub</strong>
          </Link>
          !
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) by clicking the button below:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Verify Email
        </Button>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const logo = { margin: '0 0 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(270, 60%, 15%)', margin: '0 0 20px' }
const text = { fontSize: '14px', color: 'hsl(270, 10%, 50%)', lineHeight: '1.6', margin: '0 0 25px' }
const link = { color: 'hsl(270, 100%, 25%)', textDecoration: 'underline' }
const button = { backgroundColor: 'hsl(270, 100%, 25%)', color: '#ffffff', fontSize: '14px', borderRadius: '12px', padding: '12px 24px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: 'hsl(270, 10%, 50%)', margin: '30px 0 0' }
