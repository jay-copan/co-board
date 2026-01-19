"use client";

import { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateAttendanceRecord } from "@/store/slices/attendanceSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  CalendarIcon,
  Clock,
  Download,
  Filter,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { AttendanceRecord } from "@/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading"; // Import the Loading component

export default function AdminAttendancePage() {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.user);
  const { attendanceRecords } = useAppSelector((state) => state.attendance);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [editForm, setEditForm] = useState({
    clockIn: "",
    clockOut: "",
    status: "present" as AttendanceRecord["status"],
    notes: "",
  });

  const searchParams = useSearchParams(); // Use useSearchParams

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const employee = employees.find((e) => e.id === record.employeeId);
      const matchesSearch =
        employee?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = dateFilter
        ? record.date.startsWith(format(dateFilter, "yyyy-MM-dd"))
        : true;

      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [attendanceRecords, employees, searchQuery, dateFilter, statusFilter]);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee?.name || "Unknown Employee";
  };

  const getEmployeeAvatar = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee?.avatar || "";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Late
          </Badge>
        );
      case "half_day":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Half Day
          </Badge>
        );
      case "on_leave":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <CalendarIcon className="h-3 w-3 mr-1" />
            On Leave
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateWorkHours = (clockIn?: string, clockOut?: string) => {
    if (!clockIn || !clockOut) return "-";
    const inTime = new Date(clockIn);
    const outTime = new Date(clockOut);
    const diff = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60);
    return `${diff.toFixed(1)}h`;
  };

  const openEditDialog = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setEditForm({
      clockIn: record.clockIn
        ? format(new Date(record.clockIn), "HH:mm")
        : "",
      clockOut: record.clockOut
        ? format(new Date(record.clockOut), "HH:mm")
        : "",
      status: record.status,
      notes: record.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedRecord) return;

    const baseDate = selectedRecord.date.split("T")[0];
    const updatedRecord: AttendanceRecord = {
      ...selectedRecord,
      clockIn: editForm.clockIn
        ? `${baseDate}T${editForm.clockIn}:00`
        : undefined,
      clockOut: editForm.clockOut
        ? `${baseDate}T${editForm.clockOut}:00`
        : undefined,
      status: editForm.status,
      notes: editForm.notes,
    };

    dispatch(updateAttendanceRecord(updatedRecord));
    setIsEditDialogOpen(false);
    setSelectedRecord(null);
    toast.success("Attendance record updated");
  };

  const stats = useMemo(() => {
    const todayRecords = filteredRecords;
    return {
      total: todayRecords.length,
      present: todayRecords.filter((r) => r.status === "present").length,
      absent: todayRecords.filter((r) => r.status === "absent").length,
      late: todayRecords.filter((r) => r.status === "late").length,
      onLeave: todayRecords.filter((r) => r.status === "on_leave").length,
    };
  }, [filteredRecords]);

  return (
    <Suspense fallback={<Loading />}> {/* Wrap the main content in Suspense */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage employee attendance records
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Records</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.present}
              </div>
              <p className="text-xs text-muted-foreground">Present</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <p className="text-xs text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
              <p className="text-xs text-muted-foreground">Late</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {stats.onLeave}
              </div>
              <p className="text-xs text-muted-foreground">On Leave</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-[200px] bg-transparent">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half_day">Half Day</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              {dateFilter && (
                <Button variant="ghost" onClick={() => setDateFilter(undefined)}>
                  Clear Date
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              {filteredRecords.length} records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No attendance records found
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={getEmployeeAvatar(record.employeeId) || "/placeholder.svg"}
                              alt={getEmployeeName(record.employeeId)}
                            />
                            <AvatarFallback>
                              {getEmployeeName(record.employeeId)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {getEmployeeName(record.employeeId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {record.clockIn
                          ? format(new Date(record.clockIn), "hh:mm a")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {record.clockOut
                          ? format(new Date(record.clockOut), "hh:mm a")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {calculateWorkHours(record.clockIn, record.clockOut)}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(record)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Attendance Record</DialogTitle>
              <DialogDescription>
                Update attendance details for{" "}
                {selectedRecord && getEmployeeName(selectedRecord.employeeId)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clockIn">Clock In Time</Label>
                  <Input
                    id="clockIn"
                    type="time"
                    value={editForm.clockIn}
                    onChange={(e) =>
                      setEditForm({ ...editForm, clockIn: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clockOut">Clock Out Time</Label>
                  <Input
                    id="clockOut"
                    type="time"
                    value={editForm.clockOut}
                    onChange={(e) =>
                      setEditForm({ ...editForm, clockOut: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value: AttendanceRecord["status"]) =>
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="half_day">Half Day</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  placeholder="Add notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  );
}
