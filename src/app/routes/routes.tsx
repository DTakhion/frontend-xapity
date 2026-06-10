import { createBrowserRouter, Navigate } from 'react-router';

import { RootLayout } from '@/components/layouts/root-layout';
import { AuthFlowLayout } from '@/components/layouts/auth-flow-layout';

import { LoginPage } from '@/app/login/login-page';

import { KpisPage } from '@/app/kpis/kpis-page';

import { CampaignsPage } from '@/app/campaigns/campaigns-page';
import { RecommendationPage } from '@/app/campaigns/components/recommendation-favorite';

import { ClientsPage } from '@/app/clients/clients-page';
import SegmentacionPage from '@/app/clients/segmentacion-page';
import { SegmentacionCanastasPage } from '@/app/clients/segmentacion-canastas-page';

import XapityPage from '@/app/xapity/xapity-page';
import XapityMafPage from '@/app/xapity-maf/xapity-maf-page';

import ServicesPage from '../xapity/services-page';
import StaffPage from '@/app/xapity/staff-page';
import SchedulePage from '@/app/xapity/schedule-page';

import VisionPage from '@/app/vision/VisionPage';

//import { SignupLoading } from '../signup/signup-loading';
import { SignupForm1 } from '../signup/pages/signup-form1';
import { ForgotPasswordForm } from '../signup/pages/forgot-password-form';
//import { SignupForm2 } from '../signup/pages/signup-form2';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      // Redirección automática al login
      { index: true, element: <Navigate to="/login" replace /> },

      { path: 'kpis', Component: KpisPage },

      { path: 'campaigns', Component: CampaignsPage },
      { path: 'campaigns/recommendation-favorite', Component: RecommendationPage },

      { path: 'clients', Component: ClientsPage },
      { path: 'clientes/segmentacion', Component: SegmentacionPage },
      { path: 'clients/segmentacion-canastas', Component: SegmentacionCanastasPage },

      { path: 'xapity', Component: XapityPage },
      { path: 'xapity-maf', Component: XapityMafPage },

      { path: 'services', Component: ServicesPage },
      { path: 'staff', Component: StaffPage },
      { path: 'schedule', Component: SchedulePage },

      { path: 'vision', Component: VisionPage },
    ],
  },

  {
    path: '/login',
    Component: LoginPage,
  },

  {
    path: '/auth-flow',
    Component: AuthFlowLayout,
    children: [
      { index: true, Component: SignupForm1 },
      { path: 'signup', Component: SignupForm1 },

      // { path: 'signup-continue', Component: SignupForm2 },

      {
        path: 'signup-resend-email-verification',
        Component: () => <>Resend email verification</>,
      },
      {
        path: 'password-reset',
        Component: ForgotPasswordForm,
      },
      {
        path: 'password-reset-continue',
        Component: () => <>Continue password</>,
      },
      {
        path: 'accept-invitation',
        Component: () => <>Accept invitation</>,
      },
    ],
  },
]);