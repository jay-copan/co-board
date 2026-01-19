"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/store/slices/announcementsSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Megaphone,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pin,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { Announcement } from "@/types";

export default function AnnouncementsPage() {
  const dispatch = useAppDispatch();
  const { announcements } = useAppSelector((state) => state.announcements);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { employees } = useAppSelector((state) => state.user);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal" as Announcement["priority"],
    targetAudience: "all" as Announcement["targetAudience"],
    isPinned: false,
  });

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "manager";

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "normal":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            Urgent
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            High Priority
          </Badge>
        );
      case "normal":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Low Priority
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getAuthorName = (authorId: string) => {
    const author = employees.find((e) => e.id === authorId);
    return author?.name || "Unknown";
  };

  const getAuthorAvatar = (authorId: string) => {
    const author = employees.find((e) => e.id === authorId);
    return author?.avatar || "";
  };

  const handleCreate = () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title: formData.title,
      content: formData.content,
      authorId: currentUser?.id || "",
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      isPinned: formData.isPinned,
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addAnnouncement(newAnnouncement));
    setIsCreateOpen(false);
    resetForm();
    toast.success("Announcement created successfully");
  };

  const handleEdit = () => {
    if (!selectedAnnouncement) return;

    const updated: Announcement = {
      ...selectedAnnouncement,
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      isPinned: formData.isPinned,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateAnnouncement(updated));
    setIsEditOpen(false);
    setSelectedAnnouncement(null);
    resetForm();
    toast.success("Announcement updated successfully");
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteAnnouncement(deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Announcement deleted");
  };

  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      isPinned: announcement.isPinned,
    });
    setIsEditOpen(true);
  };

  const togglePin = (announcement: Announcement) => {
    dispatch(
      updateAnnouncement({
        ...announcement,
        isPinned: !announcement.isPinned,
      })
    );
    toast.success(
      announcement.isPinned ? "Announcement unpinned" : "Announcement pinned"
    );
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "normal",
      targetAudience: "all",
      isPinned: false,
    });
  };

  const AnnouncementForm = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Announcement title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your announcement..."
          rows={5}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: Announcement["priority"]) =>
              setFormData({ ...formData, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience</Label>
          <Select
            value={formData.targetAudience}
            onValueChange={(value: Announcement["targetAudience"]) =>
              setFormData({ ...formData, targetAudience: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="department">My Department</SelectItem>
              <SelectItem value="managers">Managers Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPinned"
          checked={formData.isPinned}
          onChange={(e) =>
            setFormData({ ...formData, isPinned: e.target.checked })
          }
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="isPinned" className="text-sm font-normal">
          Pin this announcement to the top
        </Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with company news and updates
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Create a new announcement for your team
                </DialogDescription>
              </DialogHeader>
              <AnnouncementForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Publish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {sortedAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold mb-1">No announcements yet</h3>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Create your first announcement to share with your team"
                : "Check back later for company updates"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`${
                announcement.isPinned
                  ? "border-primary/50 bg-primary/5"
                  : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getPriorityIcon(announcement.priority)}
                    <div>
                      <div className="flex items-center gap-2">
                        {announcement.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        <CardTitle className="text-lg">
                          {announcement.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(announcement.createdAt), {
                          addSuffix: true,
                        })}
                        {announcement.updatedAt !== announcement.createdAt && (
                          <span className="text-xs">(edited)</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(announcement.priority)}
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => togglePin(announcement)}>
                            <Pin className="h-4 w-4 mr-2" />
                            {announcement.isPinned ? "Unpin" : "Pin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(announcement)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteTarget(announcement)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getAuthorAvatar(announcement.authorId) || "/placeholder.svg"}
                      alt={getAuthorName(announcement.authorId)}
                    />
                    <AvatarFallback>
                      {getAuthorName(announcement.authorId)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">
                      {getAuthorName(announcement.authorId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(announcement.createdAt), "PPP")}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update the announcement details</DialogDescription>
          </DialogHeader>
          <AnnouncementForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
