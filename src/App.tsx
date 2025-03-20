import { useState, useEffect, useRef } from 'react';
import { Chat, Message } from '../schema/models';
import {
  createChat,
  getChats,
  listenToChats,
  listenToMessages,
  sendMessage
} from './lib/firebase';
import ChatMessage from './components/ChatMessage';

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isUserNameSet, setIsUserNameSet] = useState<boolean>(false);
  const [newChatName, setNewChatName] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize user name
  useEffect(() => {
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
      setUserName(savedUserName);
      setIsUserNameSet(true);
    }
  }, []);

  // Save user name to local storage
  const handleSetUserName = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('userName', userName);
      setIsUserNameSet(true);
    }
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

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create a new chat
  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newChatName.trim() && isUserNameSet) {
      const chatId = await createChat(newChatName, userName);
      setCurrentChat(chatId);
      setNewChatName('');
    }
  };

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && currentChat && isUserNameSet) {
      await sendMessage(currentChat, messageInput, userName);
      setMessageInput('');
    }
  };

  // User name setup screen
  if (!isUserNameSet) {
    return (
      <div className="bg-gray-100 h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Welcome to Chat App</h1>
          <p className="mb-4">Please enter your name to continue:</p>
          <form onSubmit={handleSetUserName}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Your name"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold">Chat App</h1>
          <p>Logged in as: {userName}</p>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 p-4 container mx-auto">
        <aside className="md:block bg-gray-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>

          <form onSubmit={handleCreateChat} className="mb-4">
            <div className="flex">
              <input
                type="text"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="New chat name"
                className="flex-grow p-2 border border-gray-300 rounded-l-lg"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 rounded-r-lg"
              >
                +
              </button>
            </div>
          </form>

          <ul>
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={`p-2 rounded-lg mb-2 cursor-pointer hover:bg-gray-400 ${
                  currentChat === chat.id ? 'bg-gray-400' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentChat(chat.id)}
              >
                {chat.name}
              </li>
            ))}
            {chats.length === 0 && (
              <li className="text-gray-500 text-center p-2">
                No chats yet. Create one!
              </li>
            )}
          </ul>
        </aside>

        <section className="col-span-3 bg-white p-4 rounded-lg shadow-md flex flex-col">
          {currentChat ? (
            <>
              <div className="flex-grow overflow-y-auto p-2 max-h-[calc(100vh-200px)]">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isCurrentUser={message.user_name === userName}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-10">
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="mt-4">
                <form className="flex items-center" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a chat or create a new one to start messaging.</p>
            </div>
          )}
        </section>
      </main>
    </section>
  );
}

export default App;
