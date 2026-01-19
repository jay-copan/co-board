'use client';

import { useState } from 'react';
import { Camera, Edit2, Github, Linkedin, Mail, Globe, Twitter, Plus, Trash2, Star, Flag, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { updateUserProfile, addLink, removeLink } from '@/store/slices/userSlice';
import { flagComment } from '@/store/slices/commentsSlice';
import { submitGrievance } from '@/store/slices/adminSlice';
import { toast } from 'sonner';
import type { UserLink } from '@/types';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  website: Globe,
  twitter: Twitter,
};

const linkTypes = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email', label: 'Email' },
  { value: 'website', label: 'Website' },
  { value: 'twitter', label: 'Twitter' },
];

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const comments = useAppSelector((state) => state.comments.data);

  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState(user?.about || '');
  const [addingLink, setAddingLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkType, setNewLinkType] = useState<string>('website');
  const [loading, setLoading] = useState(false);

  const userComments = comments.filter(
    (c) => c.targetEmployeeId === user?.id && !c.flagged
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveAbout = async () => {
    setLoading(true);
    try {
      await dispatch(updateUserProfile({ about: aboutText })).unwrap();
      toast.success('About section updated');
      setEditingAbout(false);
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newLink: UserLink = {
      id: `link-${Date.now()}`,
      label: newLinkLabel.trim(),
      url: newLinkUrl.trim(),
      icon: newLinkType as UserLink['icon'],
    };

    dispatch(addLink(newLink));
    toast.success('Link added');
    setAddingLink(false);
    setNewLinkLabel('');
    setNewLinkUrl('');
    setNewLinkType('website');
  };

  const handleRemoveLink = (linkId: string) => {
    dispatch(removeLink(linkId));
    toast.success('Link removed');
  };

  const handleFlagComment = async (commentId: string) => {
    try {
      await dispatch(flagComment(commentId)).unwrap();
      await dispatch(
        submitGrievance({
          employeeId: user?.id || '',
          category: 'FLAGGED_COMMENT',
          description: `Flagged comment ID: ${commentId}`,
          relatedCommentId: commentId,
        })
      ).unwrap();
      toast.success('Comment reported to HR');
    } catch (error) {
      toast.error('Failed to report comment');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner & Profile Header */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="relative h-32 sm:h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20">
          {user.bannerImage && (
            <img
              src={user.bannerImage || "/placeholder.svg"}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 h-8 w-8"
            aria-label="Change banner"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="relative px-4 pb-6 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
                <AvatarImage src={user.profileImage || undefined} alt={user.name} />
                <AvatarFallback className="text-2xl sm:text-3xl bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8"
                aria-label="Change profile picture"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 pt-2 sm:pt-0 sm:pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground">{user.position}</p>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {user.department}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2">
              {renderStars(user.rating)}
              <span>{user.rating} ({user.ratingCount} reviews)</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* About Section */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>About</CardTitle>
              <CardDescription>Tell others about yourself</CardDescription>
            </div>
            {!editingAbout && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setAboutText(user.about);
                  setEditingAbout(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {editingAbout ? (
              <div className="space-y-4">
                <Textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Write something about yourself..."
                  rows={5}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingAbout(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAbout} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {user.about || 'No information provided yet.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* External Links */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Links</CardTitle>
              <CardDescription>Your external profiles</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setAddingLink(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {user.links.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No links added yet
              </p>
            ) : (
              <div className="space-y-2">
                {user.links.map((link) => {
                  const Icon = iconMap[link.icon] || Globe;
                  return (
                    <div
                      key={link.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{link.label}</span>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveLink(link.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Anonymous Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Anonymous Feedback</CardTitle>
          <CardDescription>
            Comments from your colleagues (identities are hidden)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userComments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No feedback received yet
            </p>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-4">
                {userComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{comment.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => handleFlagComment(comment.id)}
                      aria-label="Report comment"
                    >
                      <Flag className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Add Link Dialog */}
      <Dialog open={addingLink} onOpenChange={setAddingLink}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add External Link</DialogTitle>
            <DialogDescription>
              Add a link to your external profiles or websites
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-type">Type</Label>
              <Select value={newLinkType} onValueChange={setNewLinkType}>
                <SelectTrigger id="link-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {linkTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-label">Label</Label>
              <Input
                id="link-label"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="My GitHub"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingLink(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
