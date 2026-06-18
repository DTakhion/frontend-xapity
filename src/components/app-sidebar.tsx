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
import { UserPlus } from 'lucide-react';
//import { TeamSwitcher } from '@/components/team-switcher';
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
  maf: ['xapity-maf', 'invitations'],
  default: [
    'kpis',
    'campaigns',
    'clients',
    'xapity',
    'services',
    'staff',
    'schedule',
    'vision',
    'invitations',
  ],
} as const;

const enabledModulesByClient = {
  default: ['xapity', 'xapity-maf', 'services', 'staff', 'schedule','invitations'],
} as const;

const data = {
  user: {
    name: 'Usuario',
    email: '',
    avatar: '/avatars/shadcn.jpg',
  },
  // teams: [
  //   {
  //     name: 'Takhion Inc',
  //     logo: () => (
  //       <img
  //         src={companyLogo}
  //         alt="Takhion Inc"
  //         style={{
  //           width: 34,
  //           height: 34,
  //           borderRadius: '100%',
  //         }}
  //       />
  //     ),
  //     plan: 'Enterprise',
  //   },
  //   {
  //     name: 'Acme Corp.',
  //     logo: () => (
  //       <img
  //         src={companyLogo}
  //         alt="Takhion Inc"
  //         style={{
  //           width: 34,
  //           height: 34,
  //           borderRadius: '100%',
  //         }}
  //       />
  //     ),
  //     plan: 'Startup',
  //   },
  //   {
  //     name: 'Takhion Corp.',
  //     logo: () => (
  //       <img
  //         src={companyLogo}
  //         alt="Takhion Inc"
  //         style={{
  //           width: 34,
  //           height: 34,
  //           borderRadius: '100%',
  //         }}
  //       />
  //     ),
  //     plan: 'Free',
  //   },
  // ],
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
    {
      moduleKey: 'invitations',
      title: 'Invitaciones',
      url: '/invitations',
      icon: UserPlus,
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

  const visibleNavMain =
    currentClient === 'maf'
      ? data.navMain.filter((item) =>
        moduleVisibility.maf.includes(item.moduleKey as any)
      )
      : data.navMain.map((item) => ({
        ...item,
        disabled: !enabledModulesByClient.default.includes(
          item.moduleKey as any
        ),
      }));
  // return (
  //   <Sidebar collapsible="icon" {...props}>
  //     <SidebarHeader>
  //       <TeamSwitcher teams={data.teams} />
  //     </SidebarHeader>

  //     <SidebarContent>
  //       <NavMain items={visibleNavMain} />
  //     </SidebarContent>

  //     <SidebarFooter>
  //       <NavUser user={data.user} />
  //     </SidebarFooter>

  //     <SidebarRail />
  //   </Sidebar>
  // );
  const sidebarUser = {
    name: currentUser?.name || data.user.name,
    email: currentUser?.email || data.user.email,
    avatar: data.user.avatar,
  };

  const organizationName = currentUser?.organizationName || 'Xapity';

  const visibleNavMainByRole =
    currentUser?.role === 'admin'
      ? visibleNavMain
      : visibleNavMain.filter((item) => item.moduleKey !== 'invitations');

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <img
            src={companyLogo}
            alt={organizationName}
            className="h-9 w-9 rounded-full object-cover"
          />

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{organizationName}</span>
            <span className="truncate text-xs text-muted-foreground">
              {currentUser?.role || 'usuario'}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={visibleNavMainByRole} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}