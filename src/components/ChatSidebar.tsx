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
    e.preventDefault();
    if (newChatName.trim()) {
      await onCreateChat(newChatName);
      setNewChatName('');
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (onDeleteChat && confirm('Are you sure you want to delete this conversation?')) {
      await onDeleteChat(chatId);
    }
  };

  const handleOpenRenameDialog = (chat: Chat) => {
    setChatToRename({ id: chat.id, name: chat.name });
    setRenameChatValue(chat.name);
    setIsRenameDialogOpen(true);
  };

  const handleRenameChat = async () => {
    if (onRenameChat && chatToRename && renameChatValue.trim()) {
      await onRenameChat(chatToRename.id, renameChatValue.trim());
      setIsRenameDialogOpen(false);
      setChatToRename(null);
    }
  };

  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      {/* <div className="p-4 font-semibold flex items-center justify-between">
        <h2 className="text-lg">Conversations</h2>
      </div> */}

      <form onSubmit={handleCreateChat} className="px-3 pb-2 pt-5">
        <div className="flex w-full gap-2">
          <Input
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            placeholder="New conversation"
            className="h-9"
          />
          <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
            <Plus className="h-4 w-4" />
            <span className="sr-only">New chat</span>
          </Button>
        </div>
      </form>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {chats.map((chat) => (
            <div key={chat.id} className="flex items-center group">
              <Button
                variant={currentChat === chat.id ? "secondary" : "ghost"}
                className="flex-1 justify-start px-2 text-left"
                onClick={() => onChatSelect(chat.id)}
              >
                <div className="truncate">{chat.name}</div>
              </Button>

              {(onDeleteChat || onRenameChat) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onRenameChat && (
                      <DropdownMenuItem
                        className="flex items-center cursor-pointer"
                        onClick={() => handleOpenRenameDialog(chat)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                    )}
                    {onDeleteChat && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive flex items-center cursor-pointer"
                        onClick={() => handleDeleteChat(chat.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
          {chats.length === 0 && (
            <div className="text-center text-sm text-muted-foreground p-4">
              No conversations yet. Create one!
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameChatValue}
              onChange={(e) => setRenameChatValue(e.target.value)}
              placeholder="Enter new name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameChat}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSidebar;
