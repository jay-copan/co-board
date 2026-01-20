'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slices/uiSlice';
import { submitApprovalRequest, submitGrievance } from '@/store/slices/adminSlice';
import { attendanceRules } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { GrievanceCategory } from '@/types';

const incidentTypes: { value: GrievanceCategory; label: string }[] = [
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'THEFT', label: 'Theft / Lost Items' },
  { value: 'VERBAL_ABUSE', label: 'Verbal Abuse' },
  { value: 'WORKPLACE_SAFETY', label: 'Workplace Safety' },
  { value: 'OTHER', label: 'Other' },
];

export function DashboardModals() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const userId = useAppSelector((state) => state.auth.userId);
  const user = useAppSelector((state) => state.user.data);
  const comments = useAppSelector((state) => state.comments.data);
  const [loading, setLoading] = useState(false);

  // Form states
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [incidentType, setIncidentType] = useState<GrievanceCategory | ''>('');

  const resetForm = () => {
    setDate('');
    setReason('');
    setIncidentType('');
  };

  const handleClose = () => {
    dispatch(closeModal());
    resetForm();
  };

  const handleSubmitAttendanceFix = async () => {
    if (!userId || !date || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        submitApprovalRequest({
          type: 'ATTENDANCE_FIX',
          employeeId: userId,
          date,
          reason: reason.trim(),
        })
      ).unwrap();
      toast.success('Attendance correction request submitted');
      handleClose();
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWFH = async () => {
    if (!userId || !date || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        submitApprovalRequest({
          type: 'WFH',
          employeeId: userId,
          date,
          reason: reason.trim(),
        })
      ).unwrap();
      toast.success('WFH request submitted');
      handleClose();
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSickLeave = async () => {
    if (!userId || !date || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        submitApprovalRequest({
          type: 'SICK_LEAVE',
          employeeId: userId,
          date,
          reason: reason.trim(),
        })
      ).unwrap();
      toast.success('Sick leave application submitted');
      handleClose();
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIncident = async () => {
    if (!userId || !incidentType || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        submitGrievance({
          employeeId: userId,
          category: incidentType,
          description: reason.trim(),
        })
      ).unwrap();
      toast.success('Incident report submitted confidentially');
      handleClose();
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const userComments = comments.filter(
    (c) => c.targetEmployeeId === user?.id && !c.flagged
  );

  return (
    <>
      {/* Attendance Correction Modal */}
      <Dialog open={activeModal === 'ATTENDANCE_FIX'} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Attendance Correction Request</DialogTitle>
            <DialogDescription>
              Request an exception for late arrival or early departure. 
              You have {5 - (user?.attendanceCorrectionUsed || 0)} requests remaining.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="att-date">Date</Label>
              <Input
                id="att-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="att-reason">Reason</Label>
              <Textarea
                id="att-reason"
                placeholder="Explain why you were late or left early..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmitAttendanceFix} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WFH Modal */}
      <Dialog open={activeModal === 'WFH'} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Work From Home Request</DialogTitle>
            <DialogDescription>
              {user?.wfhEligible
                ? 'You are eligible for WFH. Submit a request for record keeping.'
                : 'You need manager approval for remote work.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wfh-date">Date</Label>
              <Input
                id="wfh-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wfh-reason">Reason</Label>
              <Textarea
                id="wfh-reason"
                placeholder="Why do you need to work from home?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmitWFH} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sick Leave Modal */}
      <Dialog open={activeModal === 'SICK_LEAVE'} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sick Leave Application</DialogTitle>
            <DialogDescription>
              Apply for sick leave. You have {3 - (user?.sickLeaveUsed || 0)} days remaining.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sick-date">Date</Label>
              <Input
                id="sick-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sick-reason">Reason</Label>
              <Textarea
                id="sick-reason"
                placeholder="Describe your condition..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmitSickLeave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Incident Report Modal */}
      <Dialog open={activeModal === 'INCIDENT'} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Incident</DialogTitle>
            <DialogDescription>
              Your report will be handled confidentially by HR.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="incident-type">Incident Type</Label>
              <Select value={incidentType} onValueChange={(v) => setIncidentType(v as GrievanceCategory)}>
                <SelectTrigger id="incident-type">
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incident-desc">Description</Label>
              <Textarea
                id="incident-desc"
                placeholder="Provide detailed information about the incident..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmitIncident} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance Rules Modal */}
      <Dialog open={activeModal === 'RULES'} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Attendance Rules & Policies</DialogTitle>
            <DialogDescription>
              Company attendance guidelines and policies
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              {attendanceRules.map((rule, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-foreground">{rule.title}</h4>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Viewer Modal */}
      <Dialog open={activeModal === 'FEEDBACK'} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Anonymous Feedback</DialogTitle>
            <DialogDescription>
              Comments from your colleagues (anonymous)
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              {userComments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No feedback received yet
                </p>
              ) : (
                userComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <p className="text-sm text-foreground">{comment.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
