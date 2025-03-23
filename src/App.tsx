import { useState, useEffect } from 'react';
import { Chat, Message } from '@/types/chat';
import {
  createChat,
  listenToChats,
  listenToMessages,
  sendMessage,
  deleteChat,
  renameChat
} from './lib/firebase';
import Header from './components/Header';
import ChatSidebar from './components/ChatSidebar';
import MessageArea from './components/MessageArea';
import UserNameForm from './components/UserNameForm';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isUserNameSet, setIsUserNameSet] = useState<boolean>(false);

  // Initialize user name
  useEffect(() => {
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
      setUserName(savedUserName);
      setIsUserNameSet(true);
    }
  }, []);

  // Save user name to local storage
  const handleSetUserName = (name: string) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    setIsUserNameSet(true);
  };

  // Load chats
  useEffect(() => {
    if (!isUserNameSet) return;

    const unsubscribe = listenToChats((loadedChats) => {
      setChats(loadedChats);

      // Set initial chat if none selected
      if (!currentChat && loadedChats.length > 0) {
        setCurrentChat(loadedChats[0].id);
      }
    });

    return () => unsubscribe();
  }, [isUserNameSet, currentChat]);

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
    if (isUserNameSet) {
      const chatId = await createChat(chatName, userName);
      setCurrentChat(chatId);
      return Promise.resolve();
    }
    return Promise.reject("User name not set");
  };

  // Send a message
  const handleSendMessage = async (text: string) => {
    if (currentChat && isUserNameSet) {
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

  // User name setup screen
  if (!isUserNameSet) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="chat-theme">
        <UserNameForm onSubmit={handleSetUserName} initialUserName={userName} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="chat-theme">
      <div className="flex h-screen flex-col bg-background">
        <Header userName={userName} />

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
                <div className="max-w-md text-center">
                  <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar or create a new one to start chatting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
