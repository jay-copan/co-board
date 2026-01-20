'use client';

import { ClipboardEdit, Home, Stethoscope, AlertTriangle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
              <Card 
                key={action.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isDisabled && dispatch(openModal(action.modal))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <action.icon className="h-5 w-5 text-primary" />
                    {remaining !== null && (
                      <Badge variant={remaining > 0 ? 'secondary' : 'destructive'} className="text-xs">
                        {remaining} left
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-sm mb-1 truncate">{action.title}</h3>
                  <p className="text-xs text-muted-foreground break-words line-clamp-2">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
