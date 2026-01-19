'use client';

import { useState } from 'react';
import { Clock, Building2, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clockIn, clockOut } from '@/store/slices/attendanceSlice';
import { toast } from 'sonner';
import type { AttendanceMode } from '@/types';

export function ClockInButton() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const { today, loading } = useAppSelector((state) => state.attendance);
  const user = useAppSelector((state) => state.user.data);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const formatTime = (time: string | null) => {
    if (!time) return '--:--';
    return time;
  };

  const handleClockIn = async (mode: AttendanceMode) => {
    if (!userId) return;

    // Check WFH eligibility if remote
    if (mode === 'REMOTE' && !user?.wfhEligible) {
      toast.warning('You are not eligible for WFH. Your request will need approval.', {
        description: 'Please submit a WFH request from the Quick Actions section.',
      });
    }

    try {
      await dispatch(clockIn({ userId, mode })).unwrap();
      toast.success(`Clocked in (${mode === 'OFFICE' ? 'Office' : 'Remote'})`);
    } catch (error) {
      toast.error('Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    if (!userId) return;

    try {
      await dispatch(clockOut(userId)).unwrap();
      toast.success('Clocked out successfully');
    } catch (error) {
      toast.error('Failed to clock out');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Attendance
        </CardTitle>
        <CardDescription>
          {isWeekend
            ? "It's the weekend! Enjoy your time off."
            : today.clockedIn
            ? `Clocked in at ${formatTime(today.clockInTime)}`
            : 'Ready to start your day?'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {today.clockedIn ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-3">
              <div className="flex items-center gap-2">
                {today.mode === 'OFFICE' ? (
                  <Building2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Home className="h-4 w-4 text-emerald-600" />
                )}
                <span className="text-sm font-medium text-emerald-600">
                  Working {today.mode === 'OFFICE' ? 'from Office' : 'Remotely'}
                </span>
              </div>
              <span className="text-sm font-medium text-emerald-600">
                Since {formatTime(today.clockInTime)}
              </span>
            </div>

            <Button
              onClick={handleClockOut}
              variant="destructive"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clocking out...
                </>
              ) : (
                'Clock Out'
              )}
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full" disabled={isWeekend || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isWeekend ? (
                  'Unavailable on Weekends'
                ) : (
                  'Clock In'
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem onClick={() => handleClockIn('OFFICE')}>
                <Building2 className="mr-2 h-4 w-4" />
                Office
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClockIn('REMOTE')}>
                <Home className="mr-2 h-4 w-4" />
                Remote
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="text-center text-xs text-muted-foreground">
          Office hours: 10:00 AM - 7:00 PM
        </div>
      </CardContent>
    </Card>
  );
}
