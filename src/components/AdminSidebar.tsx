'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  Printer,
  ListOrdered
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Etiquetas',
    href: '/labels',
    icon: LayoutDashboard
  },
  {
    name: 'Imprimir',
    href: '/print',
    icon: Printer
  },
  {
    name: 'Filas',
    href: '/queues',
    icon: ListOrdered
  },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({ isCollapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-md"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out",
          // Mobile behavior
          isMobileOpen 
            ? "translate-x-0" 
            : "-translate-x-full lg:translate-x-0",
          // Desktop width based on collapsed state
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className={cn(
            "text-xl font-semibold text-gray-800 transition-opacity duration-300",
            isCollapsed ? "lg:opacity-0 lg:hidden" : "opacity-100"
          )}>
            Admin Panel
          </h2>
          {isCollapsed && (
            <div className="hidden lg:flex justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg transition-colors duration-200",
                      "hover:bg-gray-100",
                      isActive 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                        : "text-gray-600 hover:text-gray-900",
                      isCollapsed ? "lg:justify-center lg:px-2" : ""
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isCollapsed ? "lg:mr-0" : "mr-3"
                    )} />
                    <span className={cn(
                      "font-medium transition-opacity duration-300",
                      isCollapsed ? "lg:opacity-0 lg:hidden" : "opacity-100"
                    )}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className={cn(
          "p-4 border-t border-gray-200",
          isCollapsed ? "lg:px-2" : ""
        )}>
          {isCollapsed ? (
            /* Collapsed state - vertical stack centered */
            <div className="hidden lg:flex lg:flex-col lg:items-center lg:space-y-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 w-8 h-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
          
          {/* Expanded state or mobile */}
          <div className={cn(
            "flex items-center justify-between",
            isCollapsed ? "lg:hidden" : ""
          )}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}