/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as bookingConfirmation } from './booking-confirmation.tsx'
import { template as platformWelcome } from './platform-welcome.tsx'
import { template as executiveSummary } from './executive-summary.tsx'
import { template as officeAgreementRequest } from './office-agreement-request.tsx'
import { template as agreementSignedConfirmation } from './agreement-signed-confirmation.tsx'
import { template as adminWelcome } from './admin-welcome.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-confirmation': bookingConfirmation,
  'platform-welcome': platformWelcome,
  'executive-summary': executiveSummary,
  'office-agreement-request': officeAgreementRequest,
  'agreement-signed-confirmation': agreementSignedConfirmation,
  'admin-welcome': adminWelcome,
}
