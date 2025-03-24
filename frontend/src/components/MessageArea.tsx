import { FormEvent, useEffect, useRef, useState } from 'react';
import { Message } from '@/types/chat.ts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Add color mapping function
const getAvatarColor = (char: string) => {
  const colors = [
    "bg-red-700/20", "bg-blue-700/30", "bg-green-700/30", "bg-yellow-700/30",
    "bg-purple-700/30", "bg-pink-700/30", "bg-indigo-700/30", "bg-teal-700/30",
    "bg-orange-700/30", "bg-cyan-700/30", "bg-lime-700/30", "bg-emerald-700/30",
    "bg-violet-700/30", "bg-fuchsia-700/30", "bg-rose-700/30", "bg-amber-700/30"
  ];

  // Generate consistent color based on character code
  const charCode = char.toLowerCase().charCodeAt(0);
  const colorIndex = charCode % colors.length;

  return colors[colorIndex];
};

interface MessageAreaProps {
  messages: Message[];
  userName: string;
  onSendMessage: (message: string) => Promise<void>;
}

const MessageArea = ({ messages, userName, onSendMessage }: MessageAreaProps) => {
  const [messageInput, setMessageInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      await onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 overflow-scroll">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.username === userName;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex gap-2 max-w-[80%]",
                    isCurrentUser && "flex-row-reverse"
                  )}>
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarFallback className={getAvatarColor(message.username.charAt(0))}>
                        {message.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={cn(
                        "rounded-lg px-4 py-2 max-w-3xl break-words whitespace-pre-wrap",
                        isCurrentUser
                          ? "bg-muted text-primary"
                          : "bg-muted"
                      )}>
                        {message.content}
                      </div>
                      <div className={cn(
                        "text-xs text-muted-foreground mt-1",
                        isCurrentUser && "text-right"
                      )}>
                        {message.username} · {new Date((message.created_at?.seconds ?? 0) * 1000).toLocaleTimeString([], {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex h-[50vh] items-center justify-center">
              <div className="text-center text-muted-foreground">
                {/* <p>No messages yet</p>
                <p className="text-sm">Start a conversation!</p> */}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessageArea;
