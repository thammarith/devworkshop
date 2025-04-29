import { FormEvent, useState } from 'react';
import { Chat } from '@/types/chat.ts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Trash2, Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ChatSidebarProps {
  chats: Chat[];
  currentChat: string | null;
  onChatSelect: (chatId: string) => void;
  onCreateChat: (chatName: string) => Promise<void>;
  onDeleteChat?: (chatId: string) => Promise<void>;
  onRenameChat?: (chatId: string, newName: string) => Promise<void>;
}

const ChatSidebar = ({
  chats,
  currentChat,
  onChatSelect,
  onCreateChat,
  onDeleteChat,
  onRenameChat
}: ChatSidebarProps) => {
  const [newChatName, setNewChatName] = useState<string>('');
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<{ id: string, name: string } | null>(null);
  const [renameChatValue, setRenameChatValue] = useState('');

  const handleCreateChat = async (e: FormEvent) => {
  };

  const handleDeleteChat = async (chatId: string) => {
  };

  const handleOpenRenameDialog = (chat: Chat) => {
  };

  const handleRenameChat = async () => {
  };

  return (
    <></>
  );
};

export default ChatSidebar;
