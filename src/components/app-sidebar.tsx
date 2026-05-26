import * as React from 'react';
import {
  BookOpen,
  Bot,
  ChartLine,
  Megaphone,
  Camera,
  CalendarDays,
  Users,
  ShieldCheck,
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
import { getCurrentUser } from '@/lib/auth';

//const CURRENT_CLIENT = 'maf';

const moduleVisibility = {
  maf: ['xapity-maf'],
  default: [
    'kpis',
    'campaigns',
    'clients',
    'xapity',
    'xapity-maf',
    'services',
    'staff',
    'schedule',
    'vision',
  ],
} as const;

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
      moduleKey: 'kpis',
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
      moduleKey: 'campaigns',
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
      moduleKey: 'clients',
      title: 'Clientes',
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
      moduleKey: 'xapity',
      title: 'Xapity',
      url: '/xapity',
      icon: Bot,
    },
    {
      moduleKey: 'xapity-maf',
      title: 'Xapity MAF',
      url: '/xapity-maf',
      icon: ShieldCheck,
    },
    {
      moduleKey: 'services',
      title: 'Servicios',
      url: '/services',
      icon: BookOpen,
    },
    {
      moduleKey: 'staff',
      title: 'Staff',
      url: '/staff',
      icon: Users,
    },
    {
      moduleKey: 'schedule',
      title: 'Agenda',
      url: '/schedule',
      icon: CalendarDays,
    },
    {
      moduleKey: 'vision',
      title: 'Vision',
      url: '/vision',
      icon: Camera,
    },
  ],
};

type SidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: SidebarProps) {
  const currentUser = getCurrentUser();

  const currentClient =
    currentUser?.businessId === 'maf' ? 'maf' : 'default';

  const visibleModules =
    moduleVisibility[currentClient as keyof typeof moduleVisibility] ??
    moduleVisibility.default;

  const visibleNavMain = data.navMain.filter((item) =>
    visibleModules.includes(item.moduleKey as any)
  );
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={visibleNavMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}