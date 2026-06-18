// 'use client';

// import { ChevronRight, type LucideIcon } from 'lucide-react';

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from '@/components/ui/collapsible';
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from '@/components/ui/sidebar';
// import { NavLink } from 'react-router';

// export function NavMain({
//   items,
// }: {
//   items: {
//     title: string
//     url: string
//     icon?: LucideIcon
//     isActive?: boolean,
//     disabled?: boolean
//     items?: {
//       title: string
//       url: string
//     }[]
//   }[]
// }) {
//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Platform</SidebarGroupLabel>
//       <SidebarMenu>
//         {items.map((item) => (
//           <Collapsible
//             disabled={item.disabled}
//             key={item.title}
//             asChild
//             defaultOpen={item.isActive}
//             className="group/collapsible"
//           >
//             <SidebarMenuItem>
//               <CollapsibleTrigger asChild>
//                 {/* <SidebarMenuButton tooltip={item.title}>
//                   {item.icon && <item.icon />}
//                   <span>{item.title}</span>
//                   <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                 </SidebarMenuButton> */}
//                 {item.items ? (
//                     <SidebarMenuButton tooltip={item.title}>
//                       {item.icon && <item.icon />}
//                       <span>{item.title}</span>
//                       <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                     </SidebarMenuButton>
//                   ) : (
//                     <SidebarMenuButton asChild tooltip={item.title}>
//                       <NavLink to={item.url}>
//                         {item.icon && <item.icon />}
//                         <span>{item.title}</span>
//                       </NavLink>
//                     </SidebarMenuButton>
//                   )}

//               </CollapsibleTrigger>
//               <CollapsibleContent>
//                 <SidebarMenuSub>
//                   {item.items?.map((subItem) => (
//                     <SidebarMenuSubItem key={subItem.title}>
//                       <SidebarMenuSubButton asChild>
//                         <NavLink to={subItem.url}>
//                           <span>{subItem.title}</span>
//                         </NavLink>
//                       </SidebarMenuSubButton>
//                     </SidebarMenuSubItem>
//                   ))}
//                 </SidebarMenuSub>
//               </CollapsibleContent>
//             </SidebarMenuItem>
//           </Collapsible>
//         ))}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }

'use client';

import { ChevronRight, Lock, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router';

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    disabled?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isDisabled = Boolean(item.disabled);

          return (
            <Collapsible
              disabled={isDisabled}
              key={item.title}
              asChild
              defaultOpen={!isDisabled && item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className={isDisabled ? 'opacity-45' : ''}>
                <CollapsibleTrigger asChild>
                  {item.items ? (
                    <SidebarMenuButton
                      tooltip={isDisabled ? `${item.title} próximamente` : item.title}
                      disabled={isDisabled}
                      className={isDisabled ? 'cursor-not-allowed' : ''}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>

                      {isDisabled ? (
                        <Lock className="ml-auto h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  ) : isDisabled ? (
                    <SidebarMenuButton
                      tooltip={`${item.title} próximamente`}
                      disabled
                      className="cursor-not-allowed"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <Lock className="ml-auto h-3.5 w-3.5" />
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink to={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </CollapsibleTrigger>

                {!isDisabled && item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={subItem.url}>
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
