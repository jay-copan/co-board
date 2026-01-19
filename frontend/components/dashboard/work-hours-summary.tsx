'use client';

import { useMemo } from 'react';
import { Timer, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/store/hooks';

export function WorkHoursSummary() {
  const attendance = useAppSelector((state) => state.attendance.data);
  const today = useAppSelector((state) => state.attendance.today);

  const stats = useMemo(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find((r) => r.date === todayDate);

    // Calculate today's hours
    let todayHours = todayRecord?.workHours || 0;
    if (today.clockedIn && today.clockInTime) {
      const [hours, minutes] = today.clockInTime.split(':').map(Number);
      const now = new Date();
      const elapsed = (now.getHours() - hours) + (now.getMinutes() - minutes) / 60;
      todayHours = Math.max(0, elapsed);
    }

    // Calculate this week's hours
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekRecords = attendance.filter((r) => {
      const date = new Date(r.date);
      return date >= startOfWeek && r.status !== 'WEEKEND' && r.status !== 'HOLIDAY';
    });
    const weekHours = weekRecords.reduce((sum, r) => sum + r.workHours, 0);

    // Calculate this month's hours
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthRecords = attendance.filter((r) => {
      const date = new Date(r.date);
      return date >= startOfMonth && r.status !== 'WEEKEND' && r.status !== 'HOLIDAY';
    });
    const monthHours = monthRecords.reduce((sum, r) => sum + r.workHours, 0);

    // Target hours (9 hours per day)
    const targetDaily = 9;
    const workdaysThisWeek = weekRecords.length || 1;
    const targetWeekly = workdaysThisWeek * targetDaily;
    const workdaysThisMonth = monthRecords.length || 1;
    const targetMonthly = workdaysThisMonth * targetDaily;

    return {
      today: Math.round(todayHours * 10) / 10,
      todayTarget: targetDaily,
      todayProgress: Math.min(100, (todayHours / targetDaily) * 100),
      week: Math.round(weekHours * 10) / 10,
      weekTarget: targetWeekly,
      weekProgress: Math.min(100, (weekHours / targetWeekly) * 100),
      month: Math.round(monthHours * 10) / 10,
      monthTarget: Math.round(targetMonthly * 10) / 10,
    };
  }, [attendance, today]);

  const getTrendIcon = (progress: number) => {
    if (progress >= 100) {
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    }
    if (progress >= 80) {
      return <TrendingUp className="h-4 w-4 text-amber-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-rose-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Work Hours
        </CardTitle>
        <CardDescription>Track your daily and weekly progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Today</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {stats.today}h / {stats.todayTarget}h
              </span>
              {getTrendIcon(stats.todayProgress)}
            </div>
          </div>
          <Progress value={stats.todayProgress} className="h-2" />
        </div>

        {/* This Week */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">This Week</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {stats.week}h / {stats.weekTarget}h
              </span>
              {getTrendIcon(stats.weekProgress)}
            </div>
          </div>
          <Progress value={stats.weekProgress} className="h-2" />
        </div>

        {/* This Month */}
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">This Month</span>
            <span className="text-lg font-semibold text-primary">
              {stats.month}h
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Target: {stats.monthTarget}h
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
