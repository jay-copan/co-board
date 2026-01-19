"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Clock,
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
  Building2,
  UserPlus,
  Settings,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboardPage() {
  const { employees } = useAppSelector((state) => state.user);
  const { attendanceRecords } = useAppSelector((state) => state.attendance);

  const stats = useMemo(() => {
    const active = employees.filter((e) => e.status === "active").length;
    const onLeave = employees.filter((e) => e.status === "on_leave").length;
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = attendanceRecords.filter((r) =>
      r.date.startsWith(today)
    );
    const clockedIn = todayRecords.filter(
      (r) => r.clockIn && !r.clockOut
    ).length;

    return {
      totalEmployees: employees.length,
      activeEmployees: active,
      onLeave,
      clockedInToday: clockedIn,
      attendanceRate: Math.round((active / employees.length) * 100),
    };
  }, [employees, attendanceRecords]);

  const departmentData = useMemo(() => {
    const deptCounts: Record<string, number> = {};
    employees.forEach((e) => {
      deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
    });
    return Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const weeklyAttendance = [
    { day: "Mon", present: 45, absent: 3 },
    { day: "Tue", present: 47, absent: 1 },
    { day: "Wed", present: 44, absent: 4 },
    { day: "Thu", present: 46, absent: 2 },
    { day: "Fri", present: 42, absent: 6 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const recentActivity = [
    {
      id: 1,
      type: "clock_in",
      user: "Sarah Wilson",
      time: "9:02 AM",
      avatar: "",
    },
    {
      id: 2,
      type: "leave_request",
      user: "Mike Johnson",
      time: "8:45 AM",
      avatar: "",
    },
    {
      id: 3,
      type: "clock_out",
      user: "Emily Chen",
      time: "8:30 AM",
      avatar: "",
    },
    {
      id: 4,
      type: "new_employee",
      user: "Alex Thompson",
      time: "Yesterday",
      avatar: "",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "clock_in":
        return <Clock className="h-4 w-4 text-emerald-500" />;
      case "clock_out":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "leave_request":
        return <CalendarCheck className="h-4 w-4 text-blue-500" />;
      case "new_employee":
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/employees">
              <Users className="h-4 w-4 mr-2" />
              Manage Employees
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEmployees} active, {stats.onLeave} on leave
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clocked In Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clockedInToday}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <Progress value={stats.attendanceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Leave requests awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>Employee attendance this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="present"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                    name="Present"
                  />
                  <Bar
                    dataKey="absent"
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                    name="Absent"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest employee activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                    <AvatarFallback>
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{activity.user}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getActivityIcon(activity.type)}
                      <span>
                        {activity.type === "clock_in" && "Clocked in"}
                        {activity.type === "clock_out" && "Clocked out"}
                        {activity.type === "leave_request" &&
                          "Submitted leave request"}
                        {activity.type === "new_employee" && "Joined the team"}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between bg-transparent"
              asChild
            >
              <Link href="/admin/employees">
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add New Employee
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between bg-transparent"
              asChild
            >
              <Link href="/admin/attendance">
                <span className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  View Attendance
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between bg-transparent"
              asChild
            >
              <Link href="/admin/departments">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Manage Departments
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between bg-transparent"
              asChild
            >
              <Link href="/admin/reports">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Reports
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
