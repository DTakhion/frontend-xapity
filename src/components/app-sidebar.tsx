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
  UserPlus,
  House,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
//import xapityLogo from '@/assets/images/xapity-brain.png';
import { getCurrentUser } from '@/lib/auth';

//const CURRENT_CLIENT = 'maf';

const moduleVisibility = {
  maf: ['xapity-maf', 'invitations'],
  default: [
    'kpis',
    'campaigns',
    'clients',
    'xapity',
    'xapity-luca',
    'services',
    'staff',
    'schedule',
    'visión',
    'invitations',
  ],
} as const;

const enabledModulesByClient = {
  default: ['xapity', 'xapity-luca', 'services', 'staff', 'schedule', 'invitations'],
} as const;

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  staff: 'Colaborador',
  customer: 'Cliente',
  user: 'Usuario',
};

const data = {
  user: {
    name: 'Usuario',
    email: '',
    avatar: '',
  },

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
      moduleKey: 'xapity-luca',
      title: 'Xapity Luca',
      url: '/xapity-luca',
      icon: ChartLine,
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

  const visibleNavMain =
    currentClient === 'maf'
      ? data.navMain.filter((item) =>
        moduleVisibility.maf.includes(item.moduleKey as any)
      )
      : data.navMain
        .filter((item) => item.moduleKey !== 'xapity-maf')
        .map((item) => ({
          ...item,
          disabled: !enabledModulesByClient.default.includes(
            item.moduleKey as any
          ),
        }));

  const sidebarUser = {
    name: currentUser?.name || data.user.name,
    email: currentUser?.email || data.user.email,
    avatar: data.user.avatar,
  };

  const organizationName = currentUser?.organizationName || 'Xapity';

  const roleLabel =
    roleLabels[currentUser?.role || 'user'] || 'Usuario';

  const visibleNavMainByRole =
    currentUser?.role === 'admin'
      ? visibleNavMain
      : visibleNavMain.filter((item) => item.moduleKey !== 'invitations');

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-accent">
            <House className="h-5 w-5" />
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{organizationName}</span>
            <span className="truncate text-xs text-muted-foreground">
              {roleLabel}
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