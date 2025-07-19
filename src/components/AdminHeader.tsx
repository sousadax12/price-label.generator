'use client'
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Bell, Search, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/reports': 'Reports', 
  '/documents': 'Documents',
  '/settings': 'Settings'
};

interface AdminHeaderProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminHeader({ isCollapsed = false, onToggleCollapse }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuthContext() as { user: any };
  
  const currentPageName = pageNames[pathname] || 'Admin';
  
  const breadcrumbs = [
    { name: 'Admin', href: '/dashboard' },
    { name: currentPageName, href: pathname }
  ].filter((item, index, arr) => index === 0 || item.name !== arr[0].name);

  return (
    <header className={cn(
      "fixed top-0 right-0 left-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 z-30 transition-all duration-300",
      isCollapsed ? "lg:left-16" : "lg:left-64"
    )}>
      <div className="flex items-center justify-between">
        {/* Left side - Collapse button, Breadcrumbs and Page Title */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {/* Desktop Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden lg:flex"
          >
            {isCollapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
          
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <div key={`${crumb.name}-${index}`} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
                <span
                  className={cn(
                    index === breadcrumbs.length - 1 
                      ? "text-gray-900 font-medium" 
                      : "hover:text-gray-700"
                  )}
                >
                  {crumb.name}
                </span>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}