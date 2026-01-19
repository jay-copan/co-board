'use client';

import React from "react"

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Inbox,
  Users,
  Megaphone,
  Bell,
  LogOut,
  Settings,
  UserPlus,
  UserMinus,
  ClipboardCheck,
  AlertTriangle,
  Moon,
  Sun,
  ChevronDown,
  PlusCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/uiSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { clearUserData } from '@/store/slices/userSlice';
import { clearAttendance } from '@/store/slices/attendanceSlice';
import { clearMessages } from '@/store/slices/messagesSlice';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const employeeNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Inbox', href: '/inbox', icon: Inbox },
  { title: 'Directory', href: '/directory', icon: Users },
  { title: 'Announcements', href: '/announcements', icon: Megaphone },
];

const adminNavItems = [
  { title: 'Add Employee', href: '/admin/add-employee', icon: UserPlus },
  { title: 'Remove Employee', href: '/admin/remove-employee', icon: UserMinus },
  { title: 'Create Announcement', href: '/admin/announcements', icon: PlusCircle },
  { title: 'Approvals', href: '/admin/approvals', icon: ClipboardCheck },
  { title: 'Grievances', href: '/admin/grievances', icon: AlertTriangle },
];

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const theme = useAppSelector((state) => state.ui.theme);
  const user = useAppSelector((state) => state.user.data);
  const role = useAppSelector((state) => state.auth.role);
  const unreadNotifications = useAppSelector((state) => state.notifications.unreadCount);
  const isAdmin = role === 'ADMIN';

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearUserData());
    dispatch(clearAttendance());
    dispatch(clearMessages());
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-base font-bold text-sidebar-primary-foreground">W</span>
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">WorkFlow</span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            {/* Notifications */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/announcements'}>
                      <Link href="/announcements" className="relative">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                        {unreadNotifications > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="ml-auto h-5 min-w-5 px-1 text-xs"
                          >
                            {unreadNotifications}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {employeeNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Admin Navigation */}
            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminNavItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href}>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="h-8 w-8"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-sidebar-accent transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profileImage || undefined} alt={user?.name} />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">
                      {user?.name || 'User'}
                    </p>
                    <p className="truncate text-xs text-sidebar-foreground/60">
                      {user?.email || 'user@company.com'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background px-4 md:hidden">
            <SidebarTrigger />
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-base font-bold text-primary-foreground">W</span>
            </div>
            <span className="text-lg font-semibold">WorkFlow</span>
          </div>
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
