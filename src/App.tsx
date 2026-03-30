import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded hub
const NJCareHub = lazy(() => import("./pages/NJCareHub"));

// Lazy-loaded page components
const NJHoboken = lazy(() => import("./pages/nj-office/NJHoboken"));
const NJEdison = lazy(() => import("./pages/nj-office/NJEdison"));

const NJOfficeAddendum = lazy(() => import("./pages/nj-office/NJOfficeAddendum"));
const NJBookHoboken = lazy(() => import("./pages/nj-office/NJBookHoboken"));
const NJBookAdmin = lazy(() => import("./pages/nj-office/NJBookAdmin"));
const NJFAQ = lazy(() => import("./pages/nj-office/NJFAQ"));
const NJContact = lazy(() => import("./pages/nj-office/NJContact"));
const NJProviderLogin = lazy(() => import("./pages/nj-office/NJProviderLogin"));
const NJProviderPortal = lazy(() => import("./pages/nj-office/NJProviderPortal"));
const NJResetPassword = lazy(() => import("./pages/nj-office/NJResetPassword"));
const NJCalendarShowcase = lazy(() => import("./pages/nj-office/NJCalendarShowcase"));
const NJBookingCalendarVariations = lazy(() => import("./pages/nj-office/NJBookingCalendarVariations"));
const NJCTAVariations = lazy(() => import("./pages/nj-office/NJCTAVariations"));
const NJBannerVariations = lazy(() => import("./pages/nj-office/NJBannerVariations"));
const NJScheduleVariations = lazy(() => import("./pages/nj-office/NJScheduleVariations"));
const NJPrivateOfficeShowcase = lazy(() => import("./pages/nj-office/NJPrivateOfficeShowcase"));
const NJPatientScheduleShowcase = lazy(() => import("./pages/nj-office/NJPatientScheduleShowcase"));
const NJNavbarVariations = lazy(() => import("./pages/nj-office/NJNavbarVariations"));
const NJScheduleLayoutVariations = lazy(() => import("./pages/nj-office/NJScheduleLayoutVariations"));
const NJNavMenuVariations = lazy(() => import("./pages/nj-office/NJNavMenuVariations"));
const NJFooterVariations = lazy(() => import("./pages/nj-office/NJFooterVariations"));
const NJAppointmentReminderPreview = lazy(() => import("./pages/nj-office/NJAppointmentReminderPreview"));
const AdminConsoleV2 = lazy(() => import("./pages/nj-office/AdminConsoleV2"));
const NJBookingFilterVariations = lazy(() => import("./pages/nj-office/NJBookingFilterVariations"));
const NJBookingColorVariations = lazy(() => import("./pages/nj-office/NJBookingColorVariations"));
const NJBookingConsistencyVariations = lazy(() => import("./pages/nj-office/NJBookingConsistencyVariations"));
const AdminV2Book = lazy(() => import("./pages/nj-office/AdminV2Book"));
const AdminV2Calendars = lazy(() => import("./pages/nj-office/AdminV2Calendars"));
const AdminV2Reporting = lazy(() => import("./pages/nj-office/AdminV2Reporting"));
const AdminV2Executive = lazy(() => import("./pages/nj-office/AdminV2Executive"));
const AdminV2Staffing = lazy(() => import("./pages/nj-office/AdminV2Staffing"));

const AdminV2Providers = lazy(() => import("./pages/nj-office/AdminV2Providers"));
const ProviderPerformanceDashboard = lazy(() => import("./pages/nj-office/ProviderPerformanceDashboard"));
const ProviderMetricsTable = lazy(() => import("./pages/nj-office/ProviderMetricsTable"));
const AdminV2ProviderDirectory = lazy(() => import("./pages/nj-office/AdminV2ProviderDirectory"));
const NJTourResults = lazy(() => import("./pages/nj-office/NJTourResults"));
const ExecutiveEmail = lazy(() => import("./pages/nj-office/ExecutiveEmail"));

const NJHobokenSlackExport = lazy(() => import("./pages/nj-office/NJHobokenSlackExport"));
const NJHobokenCanvaSlides = lazy(() => import("./pages/nj-office/NJHobokenCanvaSlides"));
const ProviderWelcomeEmail = lazy(() => import("./pages/nj-office/ProviderWelcomeEmail"));
const ProviderBookingConfirmationEmail = lazy(() => import("./pages/nj-office/ProviderBookingConfirmationEmail"));
const BookingEmailShowcase = lazy(() => import("./pages/nj-office/BookingEmailShowcase"));
const BookingEmailPreview = lazy(() => import("./pages/nj-office/BookingEmailPreview"));
const ProviderOpsWorkbook = lazy(() => import("./pages/nj-office/ProviderOpsWorkbook"));
const ProviderOpsGuideV2 = lazy(() => import("./pages/nj-office/ProviderOpsGuideV2"));
const NJBuildingAccessVariations = lazy(() => import("./pages/nj-office/NJBuildingAccessVariations"));
const AllProviderScheduleLayouts = lazy(() => import("./pages/nj-office/AllProviderScheduleLayouts"));
const NJAccessComparisonVariations = lazy(() => import("./pages/nj-office/NJAccessComparisonVariations"));
const ZocdocConversionChart = lazy(() => import("./pages/ZocdocConversionChart"));
const OfficeSigns = lazy(() => import("./pages/OfficeSigns"));
const EdisonOfficeSigns = lazy(() => import("./pages/EdisonOfficeSigns"));
const LedgerTemplate = lazy(() => import("./pages/LedgerTemplate"));
const PatientArrivalSign = lazy(() => import("./pages/PatientArrivalSign"));
const WelcomeEmailMichaelSanya = lazy(() => import("./pages/nj-office/WelcomeEmailMichaelSanya"));
const WelcomeEmailGalina = lazy(() => import("./pages/nj-office/WelcomeEmailGalina"));
const EmailSignOff = lazy(() => import("./pages/nj-office/EmailSignOff"));
const NJAdminOverview = lazy(() => import("./pages/nj-office/NJAdminOverview"));
const EdisonDirectionsVideo = lazy(() => import("./pages/nj-office/EdisonDirectionsVideo"));
const ProviderChecklist = lazy(() => import("./pages/nj-office/ProviderChecklist"));
const PrescribingWorkflow = lazy(() => import("./pages/nj-office/PrescribingWorkflow"));
const ProviderOnboardingPresentation = lazy(() => import("./pages/nj-office/ProviderOnboardingPresentation"));

const SiteDirectory = lazy(() => import("./pages/SiteDirectory"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const PatientScheduleTemplate = lazy(() => import("./pages/PatientScheduleTemplate"));
const CheatSheet = lazy(() => import("./pages/CheatSheet"));

const queryClient = new QueryClient();

// Minimal loading spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const GatedRoutes = () => (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<NJProviderLogin />} />
        <Route path="/provider-login" element={<Navigate to="/" replace />} />
        <Route path="/provider-portal" element={<NJProviderPortal />} />
        <Route path="/reset-password" element={<NJResetPassword />} />

        <Route path="/nj-office" element={<Navigate to="/" replace />} />
        <Route path="/nj-office/hoboken" element={<NJHoboken />} />
        <Route path="/nj-office/edison" element={<NJEdison />} />
        <Route path="/nj-office/edison/directions" element={<EdisonDirectionsVideo />} />
        <Route path="/hoboken" element={<NJHoboken />} />

        <Route path="/nj-office/office-addendum" element={<NJOfficeAddendum />} />
        <Route path="/nj-office/book-hoboken" element={<NJBookHoboken />} />
        <Route path="/nj-office/book" element={<NJBookHoboken />} />
        <Route path="/nj-office/book-admin" element={<NJBookAdmin />} />
        <Route path="/nj-office/faq" element={<NJFAQ />} />
        <Route path="/nj-office/contact" element={<NJContact />} />
        <Route path="/nj-office/provider-login" element={<Navigate to="/" replace />} />

        <Route path="/admin-login" element={<Navigate to="/admin-v2" replace />} />
        <Route path="/admin" element={<Navigate to="/admin-v2" replace />} />
        <Route path="/admin-dashboard" element={<Navigate to="/admin-v2" replace />} />
        <Route path="/admin-v2" element={<AdminConsoleV2 />} />
        <Route path="/admin-v2/book" element={<AdminV2Book />} />
        <Route path="/admin-v2/communication" element={<Navigate to="/admin-v2" replace />} />
        <Route path="/admin-v2/check-in" element={<Navigate to="/admin-v2" replace />} />
        <Route path="/admin-v2/calendars" element={<AdminV2Calendars />} />
        <Route path="/admin-v2/reporting" element={<AdminV2Reporting />} />
        <Route path="/admin-v2/executive" element={<AdminV2Executive />} />
        <Route path="/admin-v2/staffing" element={<AdminV2Staffing />} />
        <Route path="/admin-v2/providers" element={<AdminV2Providers />} />
        <Route path="/admin-v2/provider-directory" element={<AdminV2ProviderDirectory />} />
        <Route path="/admin-v2/provider-performance" element={<ProviderPerformanceDashboard />} />
        <Route path="/admin-v2/provider-metrics" element={<ProviderMetricsTable />} />
        <Route path="/admin-v2/executive-email" element={<ExecutiveEmail />} />

        <Route path="/nj-office/calendar-designs" element={<NJCalendarShowcase />} />
        <Route path="/nj-office/booking-calendar-variations" element={<NJBookingCalendarVariations />} />
        <Route path="/nj-office/cta-variations" element={<NJCTAVariations />} />
        <Route path="/nj-office/banner-variations" element={<NJBannerVariations />} />
        <Route path="/nj-office/schedule-variations" element={<NJScheduleVariations />} />
        <Route path="/nj-office/private-office-designs" element={<NJPrivateOfficeShowcase />} />
        <Route path="/nj-office/patient-schedule-designs" element={<NJPatientScheduleShowcase />} />
        <Route path="/nj-office/navbar-variations" element={<NJNavbarVariations />} />
        <Route path="/nj-office/schedule-layout-variations" element={<NJScheduleLayoutVariations />} />
        <Route path="/nj-office/nav-menu-variations" element={<NJNavMenuVariations />} />
        <Route path="/nj-office/booking-filter-variations" element={<NJBookingFilterVariations />} />
        <Route path="/nj-office/booking-color-variations" element={<NJBookingColorVariations />} />
        <Route path="/nj-office/booking-consistency-variations" element={<NJBookingConsistencyVariations />} />
        <Route path="/nj-office/appointment-reminder-preview" element={<NJAppointmentReminderPreview />} />
        <Route path="/nj-office/building-access-variations" element={<NJBuildingAccessVariations />} />
        <Route path="/nj-office/all-provider-schedule-layouts" element={<AllProviderScheduleLayouts />} />
        <Route path="/nj-office/access-comparison-variations" element={<NJAccessComparisonVariations />} />
        <Route path="/site-directory" element={<SiteDirectory />} />
        <Route path="/cheat-sheet" element={<CheatSheet />} />
        <Route path="/provider-welcome-email" element={<ProviderWelcomeEmail />} />
        <Route path="/provider-welcome-email/michael-sanya" element={<WelcomeEmailMichaelSanya />} />
        <Route path="/provider-welcome-email/galina" element={<WelcomeEmailGalina />} />
        <Route path="/provider-ops-workbook" element={<ProviderOpsWorkbook />} />
        <Route path="/provider-ops-guide" element={<ProviderOpsGuideV2 />} />
        <Route path="/provider-booking-confirmation-email" element={<ProviderBookingConfirmationEmail />} />
        <Route path="/booking-email-showcase" element={<BookingEmailShowcase />} />
        <Route path="/booking-email-preview" element={<BookingEmailPreview />} />
        <Route path="/lockbox" element={<OfficeSigns />} />
        <Route path="/edison-signs" element={<EdisonOfficeSigns />} />
        <Route path="/ledger-template" element={<LedgerTemplate />} />
        <Route path="/patient-arrival-sign" element={<PatientArrivalSign />} />
        <Route path="/footer-variations" element={<NJFooterVariations />} />
        <Route path="/new-jersey-office-hoboken" element={<NJHoboken />} />
        <Route path="/new-jersey-office-edison" element={<NJEdison />} />
        <Route path="/hoboken-slack-export" element={<NJHobokenSlackExport />} />
        <Route path="/hoboken-canva-slides" element={<NJHobokenCanvaSlides />} />
        <Route path="/patient-schedule-template" element={<PatientScheduleTemplate />} />
        <Route path="/zocdoc-conversion" element={<ZocdocConversionChart />} />
        <Route path="/email-signoff" element={<EmailSignOff />} />
        <Route path="/nj-admin-overview" element={<NJAdminOverview />} />
        <Route path="/provider-checklist" element={<ProviderChecklist />} />
        <Route path="/prescribing-workflow" element={<PrescribingWorkflow />} />
        <Route path="/provider-onboarding-presentation" element={<ProviderOnboardingPresentation />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="*" element={<GatedRoutes />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
