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
        const unsubscribe = listenToChats((loadedChats) => {
            setChats(loadedChats);

            // Set initial chat if none selected
            if (!currentChat && loadedChats.length > 0) {
                setCurrentChat(loadedChats[0].id);
            }
        });

        return () => unsubscribe();
    }, [currentChat]);

    // Load messages for current chat
    useEffect(() => {
        if (!currentChat) return;

        const unsubscribe = listenToMessages(currentChat, (loadedMessages) => {
            setMessages(loadedMessages);
        });

        return () => unsubscribe();
    }, [currentChat]);

    // Create a new chat
    const handleCreateChat = async (chatName: string) => {
        const chatId = await createChat(chatName, userName);
        setCurrentChat(chatId);
        return Promise.resolve();
    };

    // Send a message
    const handleSendMessage = async (text: string) => {
        if (currentChat) {
            await sendMessage(currentChat, text, userName);
            return Promise.resolve();
        }
        return Promise.reject("Cannot send message");
    };

    // Delete a chat
    const handleDeleteChat = async (chatId: string) => {
        try {
            await deleteChat(chatId);
            if (currentChat === chatId) {
                setCurrentChat(chats.length > 1 ? chats.find(chat => chat.id !== chatId)?.id || null : null);
                setMessages([]);
            }
            return Promise.resolve();
        } catch (error) {
            console.error("Error deleting chat:", error);
            return Promise.reject("Error deleting chat");
        }
    };

    // Rename a chat
    const handleRenameChat = async (chatId: string, newName: string) => {
        try {
            await renameChat(chatId, newName);
            return Promise.resolve();
        } catch (error) {
            console.error("Error renaming chat:", error);
            return Promise.reject("Error renaming chat");
        }
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            <Header userName={userName} onLogout={onLogout} />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="hidden md:block md:w-64 lg:w-80 h-full">
                    <ChatSidebar
                        chats={chats}
                        currentChat={currentChat}
                        onChatSelect={setCurrentChat}
                        onCreateChat={handleCreateChat}
                        onDeleteChat={handleDeleteChat}
                        onRenameChat={handleRenameChat}
                    />
                </div>

                {/* Main area */}
                <div className="flex-1 h-full">
                    {currentChat ? (
                        <MessageArea
                            messages={messages}
                            userName={userName}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            {/* Empty state */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;
