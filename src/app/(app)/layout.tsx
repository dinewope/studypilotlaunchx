
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenCheck,
  BrainCircuit,
  Calendar,
  ClipboardList,
  Gem,
  LayoutDashboard,
  Settings,
  User,
  Coins
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/logo';
import { EventsProvider } from '@/context/EventsContext';
import { CoinProvider, useCoins } from '@/context/CoinContext';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/lessons', icon: BookOpenCheck, label: 'Lessons' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/todos', icon: ClipboardList, label: 'To-Do Lists' },
  {
    href: '/study-optimizer',
    icon: BrainCircuit,
    label: 'Study Optimizer',
  },
];

const bottomNavItems = [
    { href: '/pricing', icon: Gem, label: 'Pricing & Plans' },
    { href: '#', icon: Settings, label: 'Settings' },
];

function AppHeader() {
  const { coins } = useCoins();
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex w-full items-center justify-end gap-4">
        <div className="flex items-center gap-2 font-semibold">
            <Coins className="h-6 w-6 text-yellow-500" />
            <span>{coins}</span>
        </div>
        <Avatar>
            <AvatarImage  src="/images/studypilot logo.jpeg" alt="@shadcn" />
            <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        </div>
    </header>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <EventsProvider>
      <CoinProvider>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar collapsible="icon" className="border-r">
              <SidebarHeader>
                <Logo />
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <SidebarMenu>
                  {bottomNavItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.label}
                      >
                          <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                          </Link>
                      </SidebarMenuButton>
                      </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Profile">
                        <User />
                        <span>Alex</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <AppHeader />
              <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </CoinProvider>
    </EventsProvider>
  );
}
