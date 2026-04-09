// import * as React from 'react';
// import {
//   BookOpen,
//   Bot,
//   Frame,
//   Map,
//   PieChart,
//   Settings2,
//   ChartLine,
//   Megaphone,
//   Camera,
//   Users,
// } from 'lucide-react';
// import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
// import { TeamSwitcher } from '@/components/team-switcher';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from '@/components/ui/sidebar';
// import companyLogo from '@/assets/images/company_02.png';

// // This is sample data.
// const data = {
//   user: {
//     name: 'Takhion',
//     email: 'contacto@takhion.com',
//     avatar: '/avatars/shadcn.jpg',
//   },
//   teams: [
//     {
//       name: 'Takhion Inc',
//       logo: () => (
//         <img src={companyLogo}
//           alt="Takhion Inc"
//           style={{
//             width: 34,
//             height: 34,
//             borderRadius: '100%',
//           }}
//         />
//       ),
//       // logo: GalleryVerticalEnd,
//       plan: 'Enterprise',
//     },
//     {
//       name: 'Acme Corp.',
//       // logo: AudioWaveform,
//       logo: () => (
//         <img src={companyLogo}
//           alt="Takhion Inc"
//           style={{
//             width: 34,
//             height: 34,
//             borderRadius: '100%',
//           }}
//         />
//       ),
//       plan: 'Startup',
//     },
//     {
//       name: 'Takhion Corp.',
//       // logo: Command,
//       logo: () => (
//         <img src={companyLogo}
//           alt="Takhion Inc"
//           style={{
//             width: 34,
//             height: 34,
//             borderRadius: '100%',
//           }}
//         />
//       ),
//       plan: 'Free',
//     },
//   ],
//   navMain: [
//     {
//       title: 'KPIs',
//       url: '/',
//       icon: ChartLine,
//       isActive: true,
//       items: [
//         {
//           title: 'Productos',
//           url: '/',
//         },
//         {
//           title: 'Favoritos',
//           url: '#',
//         },
//         // {
//         //   title: "Settings",
//         //   url: "#",
//         // },
//       ],
//     },
//     {
//       title: 'Campañas',
//       url: '',
//       isActive: true,
//       icon: Megaphone,
//       // isActive: true,
//       items: [
//         {
//           title: 'Nuevas',
//           url: '/campaigns',
//         },
//         {
//           title: 'Favoritas',
//           url: '/campaigns/recommendation-favorite',
//         },
//         // {
//         //   title: "Settings",
//         //   url: "#",
//         // },
//       ],
//     },
//     {
//       title: 'clientes',
//       url: '',
//       icon: Users,
//       // isActive: true,
//       items: [
//         {
//           title: 'Segmentación',
//           url: '/clientes/segmentacion',
//         },
//         {
//           title: 'Segmentación canastas',
//           url: '/clients/segmentacion-canastas',
//         },
//         {
//           title: 'Probabilidades y Similaridad',
//           url: '/clients',
//         },
//       ],
//     },
//     {
//       title: 'Modelos',
//       url: '#',
//       icon: Bot,
//       disabled: false,
//       items: [
//         {
//           title: 'Genesis',
//           url: '#',
//         },
//         {
//           title: 'Explorer',
//           url: '#',
//         },
//         {
//           title: 'Quantum',
//           url: '#',
//         },
//       ],
//     },
//     {
//       title: 'Xapity', //Chat de Xapity
//       url: '/xapity',
//       icon: Bot,
//     },
//     {
//       title: 'Servicios', // Servicios (23/03/2026)
//       url: '/services',
//       icon: BookOpen,
//     },
//     {
//       title: 'Vision',
//       url: '/vision',
//       icon: Camera,
//     },
//     {
//       title: 'Settings',
//       url: '#',
//       icon: Settings2,
//       disabled: true,
//       items: [
//         {
//           title: 'General',
//           url: '#',
//         },
//         {
//           title: 'Team',
//           url: '#',
//         },
//         {
//           title: 'Billing',
//           url: '#',
//         },
//         {
//           title: 'Limits',
//           url: '#',
//         },
//       ],
//     },
//   ],
//   projects: [
//     {
//       name: 'Design Engineering',
//       url: '#',
//       icon: Frame,
//     },
//     {
//       name: 'Sales & Marketing',
//       url: '#',
//       icon: PieChart,
//     },
//     {
//       name: 'Travel',
//       url: '#',
//       icon: Map,
//     },
//   ],
// };

// type SidebarProps = React.ComponentProps<typeof Sidebar>;

// export function AppSidebar({ ...props }: SidebarProps) {
//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <TeamSwitcher teams={data.teams} />
//       </SidebarHeader>

//       <SidebarContent>
//         <NavMain items={data.navMain} />
//       </SidebarContent>

//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

import * as React from 'react';
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  ChartLine,
  Megaphone,
  Camera,
  Users,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import companyLogo from '@/assets/images/company_02.png';

// This is sample data.
const data = {
  user: {
    name: 'Takhion',
    email: 'contacto@takhion.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Takhion Inc',
      logo: () => (
        <img
          src={companyLogo}
          alt="Takhion Inc"
          style={{
            width: 34,
            height: 34,
            borderRadius: '100%',
          }}
        />
      ),
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: () => (
        <img
          src={companyLogo}
          alt="Takhion Inc"
          style={{
            width: 34,
            height: 34,
            borderRadius: '100%',
          }}
        />
      ),
      plan: 'Startup',
    },
    {
      name: 'Takhion Corp.',
      logo: () => (
        <img
          src={companyLogo}
          alt="Takhion Inc"
          style={{
            width: 34,
            height: 34,
            borderRadius: '100%',
          }}
        />
      ),
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'KPIs',
      url: '/',
      icon: ChartLine,
      isActive: true,
      items: [
        {
          title: 'Productos',
          url: '/',
        },
        {
          title: 'Favoritos',
          url: '#',
        },
      ],
    },
    {
      title: 'Campañas',
      url: '',
      isActive: true,
      icon: Megaphone,
      items: [
        {
          title: 'Nuevas',
          url: '/campaigns',
        },
        {
          title: 'Favoritas',
          url: '/campaigns/recommendation-favorite',
        },
      ],
    },
    {
      title: 'clientes',
      url: '',
      icon: Users,
      items: [
        {
          title: 'Segmentación',
          url: '/clientes/segmentacion',
        },
        {
          title: 'Segmentación canastas',
          url: '/clients/segmentacion-canastas',
        },
        {
          title: 'Probabilidades y Similaridad',
          url: '/clients',
        },
      ],
    },
    {
      title: 'Modelos',
      url: '#',
      icon: Bot,
      disabled: false,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Xapity',
      url: '/xapity',
      icon: Bot,
    },
    {
      title: 'Servicios',
      url: '/services',
      icon: BookOpen,
    },
    {
      title: 'Vision',
      url: '/vision',
      icon: Camera,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      disabled: true,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

type SidebarProps = React.ComponentProps<typeof Sidebar>;

const MVP_VISIBLE_NAV_TITLES = ['Modelos', 'Xapity', 'Vision'];

export function AppSidebar({ ...props }: SidebarProps) {
  const filteredNavMain = data.navMain.filter((item) =>
    MVP_VISIBLE_NAV_TITLES.includes(item.title)
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}