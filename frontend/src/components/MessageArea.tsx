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
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
  };

  return (
    <></>
  );
};

export default MessageArea;
