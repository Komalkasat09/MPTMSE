// /app/dashboard/chat/page.tsx

"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/mockApi';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // shadcn/ui helper for conditional classes
import { format } from 'date-fns';
import { Send, Hash, AtSign, Circle } from 'lucide-react';

const getInitials = (name: string = "") => {
  const names = name.split(' ');
  if (names.length > 1 && names[0] && names[names.length - 1]) return `${names[0][0]}${names[names.length - 1][0]}`;
  return names[0] ? names[0][0] : 'U';
};

export default function ChatPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<any[]>([]);
  const [dms, setDms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const fetchInitialData = async () => {
        setIsLoading(true);
        const { channels: allChannels, users: userData } = await api.getChatData(user.id);
        
        // Separate channels and DMs
        const publicChannels = allChannels.filter(c => c.type !== 'dm');
        const directMessages = allChannels.filter(c => c.type === 'dm');
        
        setChannels(publicChannels);
        setDms(directMessages);
        setUsers(userData);

        if (publicChannels.length > 0) {
          handleChannelSelect(publicChannels[0]);
        }
        setIsLoading(false);
      };
      fetchInitialData();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChannelSelect = async (channel: any) => {
    setActiveChannel(channel);
    setMessages([]);
    const messageData = await api.getMessagesForChannel(channel.id);
    setMessages(messageData);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChannel || !user) return;
    
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId, authorId: user.id, content: newMessage, 
      timestamp: new Date().toISOString(), isOptimistic: true,
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");

    const result = await api.sendMessage({
      channelId: activeChannel.id, authorId: user.id, content: newMessage
    });
    
    if (result.success) {
      setMessages(prev => prev.map(m => m.id === tempId ? result.message : m));
    } else {
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const getUserById = (id: string) => users.find(u => u.id === id) || { name: 'Unknown User' };

  // For DMs, get the name of the *other* person
  const getDmName = (dm: any) => {
    if (!user) return "DM";
    const otherMemberId = dm.members.find((id: string) => id !== user.id);
    return getUserById(otherMemberId)?.name || "Unknown User";
  };

  if (isLoading) return <p>Loading chat...</p>;

  return (
    <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr_280px] h-[calc(100vh-145px)] border rounded-xl overflow-hidden">
      {/* Left Column: Channels & DMs */}
      <div className="flex flex-col border-r bg-muted/20">
        <div className="p-4 border-b"><h2 className="font-semibold">Channels & DMs</h2></div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase">Committees</h3>
            {channels.filter(c => c.type === 'committee').map(channel => (
              <Button key={channel.id} variant={activeChannel?.id === channel.id ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => handleChannelSelect(channel)}>
                <Hash className="h-4 w-4" /> {channel.name.replace(/-/g, ' ')}
              </Button>
            ))}
            <Separator className="my-2" />
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase">General</h3>
            {channels.filter(c => c.type === 'public').map(channel => (
              <Button key={channel.id} variant={activeChannel?.id === channel.id ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => handleChannelSelect(channel)}>
                <Hash className="h-4 w-4" /> {channel.name}
              </Button>
            ))}
            <Separator className="my-2" />
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase">Direct Messages</h3>
            {dms.map(dm => (
              <Button key={dm.id} variant={activeChannel?.id === dm.id ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => handleChannelSelect(dm)}>
                <AtSign className="h-4 w-4" /> {getDmName(dm)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Middle Column: Chat Window */}
      <div className="flex flex-col bg-background">
        {activeChannel ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-semibold">{activeChannel.type === 'dm' ? getDmName(activeChannel) : activeChannel.name.replace(/-/g, ' ')}</h3>
              {activeChannel.type !== 'dm' && <p className="text-sm text-muted-foreground">{activeChannel.description}</p>}
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {messages.map(msg => {
                  const author = getUserById(msg.authorId);
                  const isCurrentUser = author.id === user?.id;
                  return (
                    <div key={msg.id} className={cn("flex items-start gap-3", msg.isOptimistic && "opacity-60", isCurrentUser && "flex-row-reverse")}>
                      <Avatar className="h-8 w-8"><AvatarFallback>{getInitials(author.name)}</AvatarFallback></Avatar>
                      <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{author.name}</span>
                          <span className="text-xs opacity-70">{format(new Date(msg.timestamp), 'p')}</span>
                        </div>
                        <p className="text-sm leading-snug">{msg.content}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-muted/20">
              <div className="relative">
                <Input placeholder={`Message ${activeChannel.type === 'dm' ? '' : '#'}${activeChannel.name}`} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="pr-12" />
                <Button size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">Select a channel to start chatting.</div>
        )}
      </div>

      {/* Right Column: Members List */}
      <div className="hidden lg:flex flex-col border-l bg-muted/20">
        <div className="p-4 border-b"><h2 className="font-semibold">Members</h2></div>
        {activeChannel && (
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
            {activeChannel.members.map((memberId: string) => {
              const member = getUserById(memberId);
              return (
                <div key={memberId} className="flex items-center gap-2 p-2 rounded-md">
                  <Avatar className="h-6 w-6 text-xs"><AvatarFallback>{getInitials(member.name)}</AvatarFallback></Avatar>
                  <span className="text-sm">{member.name}</span>
                </div>
              );
            })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}