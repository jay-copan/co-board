'use client';

import { useEffect } from 'react';
import { ClockInButton } from '@/components/dashboard/clock-in-button';
import { WorkHoursSummary } from '@/components/dashboard/work-hours-summary';
import { UpcomingHolidays } from '@/components/dashboard/upcoming-holidays';
import { WorkTimeGraph } from '@/components/dashboard/work-time-graph';
import { PeerRatingSummary } from '@/components/dashboard/peer-rating-summary';
import { DashboardModals } from '@/components/dashboard/dashboard-modals';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAttendance } from '@/store/slices/attendanceSlice';
import { fetchHolidays } from '@/store/slices/holidaysSlice';
import { fetchRatings } from '@/store/slices/ratingsSlice';
import { fetchComments } from '@/store/slices/commentsSlice';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const user = useAppSelector((state) => state.user.data);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAttendance(userId));
      dispatch(fetchHolidays());
      dispatch(fetchRatings());
      dispatch(fetchComments());
    }
  }, [dispatch, userId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your attendance and work statistics.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Clock In/Out Card */}
        <div className="md:col-span-1">
          <ClockInButton />
        </div>

        {/* Work Hours Summary */}
        <div className="md:col-span-1">
          <WorkHoursSummary />
        </div>

        {/* Peer Rating */}
        <div className="md:col-span-1">
          <PeerRatingSummary />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Work Time Graph */}
        <div className="lg:col-span-2">
          <WorkTimeGraph />
        </div>

        {/* Upcoming Holidays */}
        <div className="lg:col-span-1">
          <UpcomingHolidays />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Dashboard Modals */}
      <DashboardModals />
    </div>
  );
}
