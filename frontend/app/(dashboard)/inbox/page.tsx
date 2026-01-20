'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Inbox,
  Send,
  Search,
  Plus,
  ArrowLeft,
  Loader2,
  Mail,
  MailOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMessages, sendMessage, markMessageAsRead, selectMessage } from '@/store/slices/messagesSlice';
import { fetchDirectory } from '@/store/slices/directorySlice';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import Loading from './loading';

export default function InboxPage() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const { data: messages, loading, selectedMessageId } = useAppSelector((state) => state.messages);
  const { data: directory } = useAppSelector((state) => state.directory);
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [composing, setComposing] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  // Compose form
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (userId) {
      dispatch(fetchMessages(userId));
      dispatch(fetchDirectory());
    }
  }, [dispatch, userId]);

  const inboxMessages = useMemo(() => {
    return messages
      .filter((m) => m.receiverId === userId)
      .filter(
        (m) =>
          m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [messages, userId, searchQuery]);

  const sentMessages = useMemo(() => {
    return messages
      .filter((m) => m.senderId === userId)
      .filter(
        (m) =>
          m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [messages, userId, searchQuery]);

  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId);
  }, [messages, selectedMessageId]);

  const unreadCount = inboxMessages.filter((m) => !m.read).length;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSelectMessage = async (messageId: string) => {
    dispatch(selectMessage(messageId));
    const message = messages.find((m) => m.id === messageId);
    if (message && !message.read && message.receiverId === userId) {
      await dispatch(markMessageAsRead(messageId));
    }
  };

  const handleSendMessage = async () => {
    if (!userId || !recipient || !subject.trim() || !body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSendLoading(true);
    try {
      await dispatch(
        sendMessage({
          senderId: userId,
          receiverId: recipient,
          subject: subject.trim(),
          body: body.trim(),
        })
      ).unwrap();
      toast.success('Message sent');
      setComposing(false);
      setRecipient('');
      setSubject('');
      setBody('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSendLoading(false);
    }
  };

  const otherEmployees = directory.filter((e) => e.id !== userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Inbox</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your internal messages
          </p>
        </div>
        <Button onClick={() => setComposing(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Compose
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Message List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'inbox' | 'sent')}>
              <TabsList className="w-full justify-start rounded-none border-b px-4">
                <TabsTrigger value="inbox" className="relative gap-2">
                  <Inbox className="h-4 w-4" />
                  Inbox
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent" className="gap-2">
                  <Send className="h-4 w-4" />
                  Sent
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inbox" className="m-0">
                <ScrollArea className="h-[calc(100vh-400px)] min-h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : inboxMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <Mail className="h-12 w-12 text-muted-foreground/30" />
                      <p className="mt-4 text-sm text-muted-foreground">No messages</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {inboxMessages.map((message) => (
                        <button
                          key={message.id}
                          onClick={() => handleSelectMessage(message.id)}
                          className={cn(
                            'w-full p-4 text-left transition-colors hover:bg-muted/50',
                            selectedMessageId === message.id && 'bg-muted',
                            !message.read && 'bg-primary/5'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {message.read ? (
                              <MailOpen className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <Mail className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={cn(
                                  "text-sm truncate",
                                  !message.read && "font-semibold"
                                )}>
                                  {message.senderName}
                                </span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  {formatDate(message.timestamp)}
                                </span>
                              </div>
                              <p className={cn(
                                "text-sm truncate",
                                !message.read ? "text-foreground" : "text-muted-foreground"
                              )}>
                                {message.subject}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="sent" className="m-0">
                <ScrollArea className="h-[calc(100vh-400px)] min-h-[300px]">
                  {sentMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <Send className="h-12 w-12 text-muted-foreground/30" />
                      <p className="mt-4 text-sm text-muted-foreground">No sent messages</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {sentMessages.map((message) => (
                        <button
                          key={message.id}
                          onClick={() => handleSelectMessage(message.id)}
                          className={cn(
                            'w-full p-4 text-left transition-colors hover:bg-muted/50',
                            selectedMessageId === message.id && 'bg-muted'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Send className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm truncate">
                                  To: {message.receiverName}
                                </span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  {formatDate(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {message.subject}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-2">
          {selectedMessage ? (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => dispatch(selectMessage(null))}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                    <CardDescription>
                      {selectedMessage.senderId === userId ? (
                        <>To: {selectedMessage.receiverName}</>
                      ) : (
                        <>From: {selectedMessage.senderName}</>
                      )}
                      {' • '}
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm text-foreground">
                  {selectedMessage.body}
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <Mail className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">Select a message to read</p>
            </div>
          )}
        </Card>
      </div>

      {/* Compose Dialog */}
      <Dialog open={composing} onOpenChange={setComposing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a message to a colleague
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">To</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {otherEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sendLoading} className="gap-2">
              {sendLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
