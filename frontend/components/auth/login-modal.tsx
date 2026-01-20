'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slices/uiSlice';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { fetchAttendance } from '@/store/slices/attendanceSlice';
import { fetchHolidays } from '@/store/slices/holidaysSlice';
import { fetchNotifications } from '@/store/slices/notificationsSlice';
import { toast } from 'sonner';

export function LoginModal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const { loading, error } = useAppSelector((state) => state.auth);
  const isOpen = activeModal === 'LOGIN';

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(clearError());
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      const result = await dispatch(loginUser({ username: username.trim(), password })).unwrap();
      
      // Fetch user data after successful login
      await Promise.all([
        dispatch(fetchUserProfile(result.userId)),
        dispatch(fetchAttendance(result.userId)),
        dispatch(fetchHolidays()),
        dispatch(fetchNotifications()),
      ]);

      toast.success('Welcome back!');
      handleClose();
      router.push('/dashboard');
    } catch (err) {
      toast.error(err as string || 'Login failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Welcome Back</DialogTitle>
          <DialogDescription>
            Sign in to access your employee dashboard
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="john.anderson"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                disabled={loading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm text-muted-foreground"
            >
              Forgot password?
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Demo credentials:</strong>
              <br />
              Employee: john.anderson / password123
              <br />
              Admin: jennifer.williams / admin123
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
