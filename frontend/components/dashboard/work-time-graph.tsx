'use client';

import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useAppSelector } from '@/store/hooks';

type ViewType = 'weekly' | 'monthly' | 'yearly';

export function WorkTimeGraph() {
  const [view, setView] = useState<ViewType>('weekly');
  const attendance = useAppSelector((state) => state.attendance.data);
  const theme = useAppSelector((state) => state.ui.theme);

  const chartData = useMemo(() => {
    const today = new Date();

    if (view === 'weekly') {
      // Last 7 days
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const record = attendance.find((r) => r.date === dateStr);

        data.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: dateStr,
          hours: record?.workHours || 0,
          status: record?.status || 'ABSENT',
          isOnTime: record?.status === 'ON_TIME',
        });
      }
      return data;
    }

    if (view === 'monthly') {
      // Last 4 weeks
      const data = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekRecords = attendance.filter((r) => {
          const date = new Date(r.date);
          return date >= weekStart && date <= weekEnd && r.status !== 'WEEKEND' && r.status !== 'HOLIDAY';
        });

        const totalHours = weekRecords.reduce((sum, r) => sum + r.workHours, 0);
        const lateCount = weekRecords.filter((r) => r.status === 'LATE' || r.status === 'EARLY').length;

        data.push({
          name: `Week ${4 - i}`,
          hours: Math.round(totalHours * 10) / 10,
          status: lateCount > weekRecords.length / 2 ? 'LATE' : 'ON_TIME',
          isOnTime: lateCount <= weekRecords.length / 2,
        });
      }
      return data;
    }

    // Yearly - last 12 months
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const monthRecords = attendance.filter((r) => {
        const date = new Date(r.date);
        return date >= monthDate && date <= monthEnd && r.status !== 'WEEKEND' && r.status !== 'HOLIDAY';
      });

      const totalHours = monthRecords.reduce((sum, r) => sum + r.workHours, 0);
      const lateCount = monthRecords.filter((r) => r.status === 'LATE' || r.status === 'EARLY').length;

      data.push({
        name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        hours: Math.round(totalHours * 10) / 10,
        status: lateCount > monthRecords.length / 3 ? 'LATE' : 'ON_TIME',
        isOnTime: lateCount <= monthRecords.length / 3,
      });
    }
    return data;
  }, [attendance, view]);

  const chartConfig = {
    hours: {
      label: 'Work Hours',
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Work Time Overview
          </CardTitle>
          <CardDescription>
            Your attendance patterns over time
          </CardDescription>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as ViewType)}>
          <TabsList className="h-8">
            <TabsTrigger value="weekly" className="text-xs">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                className="fill-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                className="fill-muted-foreground"
                tickFormatter={(value) => `${value}h`}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={50}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.status === 'WEEKEND' || entry.status === 'HOLIDAY'
                        ? 'hsl(var(--muted))'
                        : entry.isOnTime
                        ? '#3b82f6'
                        : '#ef4444'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-blue-500" />
            <span className="text-muted-foreground">On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-destructive" />
            <span className="text-muted-foreground">Late/Early</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
