/* import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/components/layouts/root-layout';
import { AuthFlowLayout } from '@/components/layouts/auth-flow-layout';
import { LoginPage } from '@/app/login/login-page';
import { KpisPage } from '@/app/kpis/kpis-page';
import { CampaignsPage } from '@/app/campaigns/campaigns-page';
import { ClientsPage } from '@/app/clients/clients-page';
import { SignupLoading } from '../signup/signup-loading';
import { SignupForm1 } from '../signup/pages/signup-form1';
import { SignupForm2 } from '../signup/pages/signup-form2';
import SegmentacionPage from '@/app/clients/segmentacion-page';
import { SegmentacionCanastasPage } from '@/app/clients/segmentacion-canastas-page';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, path: '', Component: KpisPage },
      { path: 'campaigns', Component: CampaignsPage },
      { path: 'clients', Component: ClientsPage },
      { path: 'clientes/segmentacion', Component: SegmentacionPage },
      { path: 'clients/segmentacion-canastas', Component: SegmentacionCanastasPage },
    ]
  },
  { path: '/login', Component: LoginPage },
  {
    path: '/auth-flow',
    Component: AuthFlowLayout,
    children: [
      { index: true, path: '', Component: SignupLoading },
      { path: 'signup', Component: SignupForm1 },
      { path: 'signup-continue', Component: SignupForm2 },
      { path: 'signup-resend-email-verification', Component: () => <>Resend email verification</> },
      { path: 'password-reset', Component: () => <>Password reset</> },
      { path: 'password-reset-continue', Component: () => <>Continue password</> },
      { path: 'accept-invitation', Component: () => <>Accept invitation</> },
    ]
  },
]);  */

// import { createBrowserRouter } from 'react-router';
// import { RootLayout } from '@/components/layouts/root-layout';
// import { AuthFlowLayout } from '@/components/layouts/auth-flow-layout';
// import { LoginPage } from '@/app/login/login-page';
// import { KpisPage } from '@/app/kpis/kpis-page';
// import { CampaignsPage } from '@/app/campaigns/campaigns-page';
// import { ClientsPage } from '@/app/clients/clients-page';
// import { SignupLoading } from '../signup/signup-loading';
// import { SignupForm1 } from '../signup/pages/signup-form1';
// import { SignupForm2 } from '../signup/pages/signup-form2';
// import SegmentacionPage from '@/app/clients/segmentacion-page';
// import { SegmentacionCanastasPage } from '@/app/clients/segmentacion-canastas-page';
// //nueva pagina para pagina de xapity
// import XapityPage from '@/app/xapity/xapity-page';
// //nueva pagina para pagina de servicios
// import ServicesPage from '../xapity/services-page';

// // ✅ NUEVO: página para recomendaciones favoritas
// import { RecommendationPage } from '@/app/campaigns/components/recommendation-favorite';

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     Component: RootLayout,
//     children: [
//       { index: true, path: '', Component: KpisPage },
//       { path: 'campaigns', Component: CampaignsPage },

//       // ✅ Nueva ruta directa sin modificar estructura
//       { path: 'campaigns/recommendation-favorite', Component: RecommendationPage },

//       { path: 'clients', Component: ClientsPage },
//       { path: 'clientes/segmentacion', Component: SegmentacionPage },
//       { path: 'clients/segmentacion-canastas', Component: SegmentacionCanastasPage },
//       //Ruta hacia pagina de xapity
//       { path: 'xapity', Component: XapityPage},
//       //Ruta hacia pagina de servicios (23-03-2026)
//       { path: 'services', Component: ServicesPage},
//     ]
//   },
//   { path: '/login', Component: LoginPage },
//   {
//     path: '/auth-flow',
//     Component: AuthFlowLayout,
//     children: [
//       { index: true, path: '', Component: SignupLoading },
//       { path: 'signup', Component: SignupForm1 },
//       { path: 'signup-continue', Component: SignupForm2 },
//       { path: 'signup-resend-email-verification', Component: () => <>Resend email verification</> },
//       { path: 'password-reset', Component: () => <>Password reset</> },
//       { path: 'password-reset-continue', Component: () => <>Continue password</> },
//       { path: 'accept-invitation', Component: () => <>Accept invitation</> },
//     ]
//   },
// ]);

import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/components/layouts/root-layout';
import { AuthFlowLayout } from '@/components/layouts/auth-flow-layout';
import { LoginPage } from '@/app/login/login-page';
import { KpisPage } from '@/app/kpis/kpis-page';
import { CampaignsPage } from '@/app/campaigns/campaigns-page';
import { ClientsPage } from '@/app/clients/clients-page';
import { SignupLoading } from '../signup/signup-loading';
import { SignupForm1 } from '../signup/pages/signup-form1';
import { SignupForm2 } from '../signup/pages/signup-form2';
import SegmentacionPage from '@/app/clients/segmentacion-page';
import { SegmentacionCanastasPage } from '@/app/clients/segmentacion-canastas-page';
import XapityPage from '@/app/xapity/xapity-page';
import ServicesPage from '../xapity/services-page';
import { RecommendationPage } from '@/app/campaigns/components/recommendation-favorite';
import VisionPage from '@/app/vision/VisionPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, path: '', Component: KpisPage },
      { path: 'campaigns', Component: CampaignsPage },
      { path: 'campaigns/recommendation-favorite', Component: RecommendationPage },
      { path: 'clients', Component: ClientsPage },
      { path: 'clientes/segmentacion', Component: SegmentacionPage },
      { path: 'clients/segmentacion-canastas', Component: SegmentacionCanastasPage },
      { path: 'xapity', Component: XapityPage },
      { path: 'services', Component: ServicesPage },
      { path: 'vision', Component: VisionPage },
    ],
  },
  { path: '/login', Component: LoginPage },
  {
    path: '/auth-flow',
    Component: AuthFlowLayout,
    children: [
      { index: true, path: '', Component: SignupLoading },
      { path: 'signup', Component: SignupForm1 },
      { path: 'signup-continue', Component: SignupForm2 },
      { path: 'signup-resend-email-verification', Component: () => <>Resend email verification</> },
      { path: 'password-reset', Component: () => <>Password reset</> },
      { path: 'password-reset-continue', Component: () => <>Continue password</> },
      { path: 'accept-invitation', Component: () => <>Accept invitation</> },
    ],
  },
]);
