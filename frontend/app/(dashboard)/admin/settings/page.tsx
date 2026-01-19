"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  updateOrganizationSettings,
  addDepartment,
  removeDepartment,
  addHoliday,
  removeHoliday,
} from "@/store/slices/adminSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Building2,
  Clock,
  Calendar as CalendarIcon,
  Plus,
  X,
  Save,
  Settings,
  Bell,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const dispatch = useAppDispatch();
  const { organizationSettings, departments, holidays } = useAppSelector(
    (state) => state.admin
  );

  const [settings, setSettings] = useState(organizationSettings);
  const [newDepartment, setNewDepartment] = useState("");
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: "",
    date: undefined as Date | undefined,
    type: "public" as "public" | "optional" | "restricted",
    description: "",
  });

  const handleSaveSettings = () => {
    dispatch(updateOrganizationSettings(settings));
    toast.success("Settings saved successfully");
  };

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) return;
    dispatch(addDepartment(newDepartment.trim()));
    setNewDepartment("");
    toast.success("Department added");
  };

  const handleRemoveDepartment = (dept: string) => {
    dispatch(removeDepartment(dept));
    toast.success("Department removed");
  };

  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    dispatch(
      addHoliday({
        id: `holiday_${Date.now()}`,
        name: newHoliday.name,
        date: format(newHoliday.date, "yyyy-MM-dd"),
        type: newHoliday.type,
        description: newHoliday.description,
      })
    );
    setIsAddHolidayOpen(false);
    setNewHoliday({
      name: "",
      date: undefined,
      type: "public",
      description: "",
    });
    toast.success("Holiday added");
  };

  const handleRemoveHoliday = (id: string) => {
    dispatch(removeHoliday(id));
    toast.success("Holiday removed");
  };

  const getHolidayTypeBadge = (type: string) => {
    switch (type) {
      case "public":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Public
          </Badge>
        );
      case "optional":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            Optional
          </Badge>
        );
      case "restricted":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            Restricted
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your organization&apos;s attendance and management settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Clock className="h-4 w-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building2 className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="holidays">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Holidays
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Basic information about your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={settings.organizationName}
                    onChange={(e) =>
                      setSettings({ ...settings, organizationName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) =>
                      setSettings({ ...settings, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value) =>
                    setSettings({ ...settings, dateFormat: value })
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Hours Configuration</CardTitle>
              <CardDescription>
                Set default work hours and attendance rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workStart">Work Day Start</Label>
                  <Input
                    id="workStart"
                    type="time"
                    value={settings.workDayStart}
                    onChange={(e) =>
                      setSettings({ ...settings, workDayStart: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workEnd">Work Day End</Label>
                  <Input
                    id="workEnd"
                    type="time"
                    value={settings.workDayEnd}
                    onChange={(e) =>
                      setSettings({ ...settings, workDayEnd: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graceIn">Grace Period (Clock In)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="graceIn"
                      type="number"
                      value={settings.graceMinutesIn}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          graceMinutesIn: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graceOut">Grace Period (Clock Out)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="graceOut"
                      type="number"
                      value={settings.graceMinutesOut}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          graceMinutesOut: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Location for Clock In</Label>
                    <p className="text-sm text-muted-foreground">
                      Employees must share location when clocking in
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireLocationClockIn}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, requireLocationClockIn: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Remote Clock In</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to clock in from remote locations
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowRemoteClockIn}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, allowRemoteClockIn: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Clock Out</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically clock out employees at end of work day
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoClockOut}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoClockOut: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Manage organization departments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New department name"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDepartment()}
                />
                <Button onClick={handleAddDepartment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Badge
                    key={dept}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {dept}
                    <button
                      onClick={() => handleRemoveDepartment(dept)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Company Holidays</CardTitle>
                <CardDescription>
                  Manage organization holidays and time off
                </CardDescription>
              </div>
              <Dialog open={isAddHolidayOpen} onOpenChange={setIsAddHolidayOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holiday
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Holiday</DialogTitle>
                    <DialogDescription>
                      Add a new company holiday to the calendar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="holidayName">Holiday Name *</Label>
                      <Input
                        id="holidayName"
                        value={newHoliday.name}
                        onChange={(e) =>
                          setNewHoliday({ ...newHoliday, name: e.target.value })
                        }
                        placeholder="e.g., New Year's Day"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-transparent"
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {newHoliday.date
                              ? format(newHoliday.date, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newHoliday.date}
                            onSelect={(date) =>
                              setNewHoliday({ ...newHoliday, date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holidayType">Type</Label>
                      <Select
                        value={newHoliday.type}
                        onValueChange={(value: "public" | "optional" | "restricted") =>
                          setNewHoliday({ ...newHoliday, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public Holiday</SelectItem>
                          <SelectItem value="optional">
                            Optional Holiday
                          </SelectItem>
                          <SelectItem value="restricted">
                            Restricted Holiday
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holidayDesc">Description</Label>
                      <Textarea
                        id="holidayDesc"
                        value={newHoliday.description}
                        onChange={(e) =>
                          setNewHoliday({
                            ...newHoliday,
                            description: e.target.value,
                          })
                        }
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddHolidayOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddHoliday}>Add Holiday</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holidays.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No holidays configured. Add your first holiday above.
                  </p>
                ) : (
                  holidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{holiday.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(holiday.date), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getHolidayTypeBadge(holiday.type)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveHoliday(holiday.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send push notifications to mobile devices
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, pushNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Late Clock-In Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert managers when employees clock in late
                  </p>
                </div>
                <Switch
                  checked={settings.lateClockInAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, lateClockInAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Leave Request Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify managers of new leave requests
                  </p>
                </div>
                <Switch
                  checked={settings.leaveRequestAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, leaveRequestAlerts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
