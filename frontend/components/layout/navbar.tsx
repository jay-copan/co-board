'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun, X, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme, openModal } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isTranslucent?: boolean;
}

export function Navbar({ isTranslucent = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLoginClick = () => {
    dispatch(openModal('LOGIN'));
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTranslucent
          ? 'bg-background/60 backdrop-blur-md border-b border-border/50'
          : 'bg-background border-b border-border'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg">
            <img 
              src="/copan.png" 
              alt="Logo" 
              className="h-7 w-7 object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-foreground">co-board</span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {!isAuthenticated && pathname === '/' && (
            <Button onClick={handleLoginClick} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col gap-4 pt-8">
                {!isAuthenticated && pathname === '/' && (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLoginClick();
                    }}
                    className="w-full gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
