'use client';

import { ClipboardEdit, Home, Stethoscope, AlertTriangle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openModal } from '@/store/slices/uiSlice';

const actions = [
  {
    id: 'ATTENDANCE_FIX',
    title: 'Attendance Correction',
    description: 'Request exception for late arrival or early departure',
    icon: ClipboardEdit,
    modal: 'ATTENDANCE_FIX' as const,
    limit: 5,
    usedKey: 'attendanceCorrectionUsed',
  },
  {
    id: 'WFH',
    title: 'Work From Home',
    description: 'Request approval for remote work',
    icon: Home,
    modal: 'WFH' as const,
  },
  {
    id: 'SICK_LEAVE',
    title: 'Sick Leave',
    description: 'Apply for sick leave',
    icon: Stethoscope,
    modal: 'SICK_LEAVE' as const,
    limit: 3,
    usedKey: 'sickLeaveUsed',
  },
  {
    id: 'INCIDENT',
    title: 'Report Incident',
    description: 'Report workplace issues confidentially',
    icon: AlertTriangle,
    modal: 'INCIDENT' as const,
  },
  {
    id: 'RULES',
    title: 'Attendance Rules',
    description: 'View company attendance policies',
    icon: BookOpen,
    modal: 'RULES' as const,
  },
];

export function QuickActions() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);

  const getRemainingCount = (action: typeof actions[0]) => {
    if (!action.limit || !action.usedKey || !user) return null;
    const used = user[action.usedKey as keyof typeof user] as number || 0;
    return action.limit - used;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Manage your attendance requests and view policies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {actions.map((action) => {
            const remaining = getRemainingCount(action);
            const isDisabled = remaining !== null && remaining <= 0;

            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4 text-left bg-transparent"
                onClick={() => dispatch(openModal(action.modal))}
                disabled={isDisabled}
              >
                <div className="flex w-full items-center justify-between">
                  <action.icon className="h-5 w-5 text-primary" />
                  {remaining !== null && (
                    <Badge variant={remaining > 0 ? 'secondary' : 'destructive'} className="text-xs">
                      {remaining} left
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
