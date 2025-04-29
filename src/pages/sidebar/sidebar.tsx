import * as React from 'react';

import { SearchForm } from './search-form';
import { VersionSwitcher } from './version-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

// This is sample data.


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

function getFirstNameFromEmail(email: string): string {
  const username: string = email?.split('@')[0];
  const firstName: string = username?.split('.')[0];
  return (
    firstName?.charAt(0).toUpperCase() + firstName?.slice(1).toLowerCase()
  );
}

const currentUser = localStorage.getItem('current-user');

const data = {
  user: {
    name: getFirstNameFromEmail(currentUser||'m@example.com'),
    email: currentUser,
    avatar: 'https://ui.shadcn.com/avatars/shadcn.jpg'
  },
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        {
          title: 'Tenant List',
          url: '/'
        },
        {
          title: 'Onboarding Setup',
          url: '/onboarding-flow'
        }
      ]
    }
  ]
};

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-slate-500">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className=""
                      >
                        <a href={item.url}>{item.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
