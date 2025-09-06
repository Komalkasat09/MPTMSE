// /app/dashboard/layout.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home, Users, Calendar, Settings, LogOut, ChevronRight, Menu, X, User, Wrench, MessageCircle, TrophyIcon } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useState } from "react";

const getInitials = (name: string = "") => {
  const names = name.split(' ');
  if (names.length > 1 && names[0] && names[names.length - 1]) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return names[0] ? names[0][0] : 'U';
};

const navigationItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
    description: "Overview and analytics"
  },
  {
    href: "/dashboard/committees",
    icon: Users,
    label: "Committees",
    description: "Manage committees"
  },
  {
    href: "/dashboard/events",
    icon: Calendar,
    label: "Events Calendar",
    description: "Schedule and events"
  },
  {
    href: "/dashboard/attendance",
    icon: Calendar,
    label: "Attendance",
    description: "Track attendance and leave requests"
  },
  {
    href: "/dashboard/tasks",
    icon: Wrench,
    label: "Applications",
    description: "Apply for opportunities and positions"
  },
  {
    href: "/dashboard/chat",
    icon: MessageCircle,
    label: "Chat",
    description: "Communicate with team members"
  },
  {
    href: "/dashboard/achievements",
    icon: TrophyIcon,
    label: "Achievements",
    description: "View accomplishments and milestones"
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return null; 
  }

  // Helper function to determine if link is active
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  // Enhanced link classes with smooth transitions
  const getLinkClasses = (path: string) => {
    const active = isActive(path);
    return `group relative flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] ${
      active
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
    }`;
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Brand Section */}
      <div className="flex h-16 items-center border-b border-border/50 px-6 lg:h-20">
        <Link 
          href="/dashboard" 
          className="group flex items-center gap-3 font-bold text-lg transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Home className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Campus Solutions
          </span>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          <div className="px-2 py-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Navigation
            </h2>
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={getLinkClasses(item.href)}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                      active 
                        ? 'bg-primary-foreground/20 text-primary-foreground' 
                        : 'bg-accent/50 text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs transition-colors duration-200 ${
                        active 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {active && (
                    <ChevronRight className="h-4 w-4 text-primary-foreground/70" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info Card in Sidebar */}
        <div className="mt-auto pt-6">
          <div className="rounded-xl bg-accent/30 border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src="#" alt="@user" />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Fixed Position */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm hidden md:block lg:w-[320px]">
        <div className="flex h-full max-h-screen flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform border-r border-border/50 bg-card/95 backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full max-h-screen flex-col">
          <SidebarContent />
        </div>
      </div>
      
      {/* Main Content Area - With Left Margin for Fixed Sidebar */}
      <div className="flex flex-col min-h-screen md:ml-80 lg:ml-[320px]">
          {/* Enhanced Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-card/80 backdrop-blur-lg px-4 lg:h-20 lg:px-8">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-accent/50"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>

            {/* Header Content */}
            <div className="flex flex-1 items-center justify-between">
              <div className="flex-1">
                {/* Page Title - Dynamic based on current route */}
                <h1 className="text-lg font-semibold text-foreground lg:text-xl">
                  {navigationItems.find(item => isActive(item.href))?.label || 'Dashboard'}
                </h1>
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                
                {/* Enhanced User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-12 w-12 rounded-full hover:bg-accent/50 transition-all duration-200 hover:scale-105"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-all duration-200 hover:ring-primary/30">
                        <AvatarImage src="#" alt="@user" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-64 p-2 bg-card/95 backdrop-blur-lg border-border/50"
                  >
                    <DropdownMenuLabel className="p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-3 hover:bg-accent/50 rounded-md cursor-pointer transition-colors">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-3 hover:bg-accent/50 rounded-md cursor-pointer transition-colors">
                      <Link href="/dashboard/profile">
                        <User className="mr-3 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="p-3 hover:bg-destructive/10 hover:text-destructive rounded-md cursor-pointer transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          {/* Main Content with Enhanced Spacing */}
          <main className="flex-1 overflow-y-auto bg-background/50">
            <div className="container mx-auto p-6 lg:p-8 xl:p-10 space-y-8">
              {children}
            </div>
          </main>
        </div>
    </div>
  );
}