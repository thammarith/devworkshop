import { useState, useEffect } from 'react';
import { Chat, Message } from '@/types/chat';
import {
    createChat,
    listenToChats,
    listenToMessages,
    sendMessage,
    deleteChat,
    renameChat
} from '@/lib/firebase';
import Header from '@/components/Header';
import ChatSidebar from '@/components/ChatSidebar';
import MessageArea from '@/components/MessageArea';

interface ChatsPageProps {
    userName: string;
    onLogout?: () => void;
}

const ChatsPage = ({ userName, onLogout }: ChatsPageProps) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentChat, setCurrentChat] = useState<string | null>(null);

    // Load chats
    useEffect(() => {
    }, [currentChat]);

    // Load messages for current chat
    useEffect(() => {
    }, [currentChat]);

    // Create a new chat
    const handleCreateChat = async (chatName: string) => {
    };

    // Send a message
    const handleSendMessage = async (text: string) => {
    };

    // Delete a chat
    const handleDeleteChat = async (chatId: string) => {
    };

    // Rename a chat
    const handleRenameChat = async (chatId: string, newName: string) => {
    };

    return (
        <></>
    );
};

export default ChatsPage;
