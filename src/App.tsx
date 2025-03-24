import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import HomePage from '@/pages/HomePage';
import ChatsPage from '@/pages/ChatsPage';

function App() {
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

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName('');
    setIsUserNameSet(false);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="chat-theme">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isUserNameSet ?
                <Navigate to="/chats" /> :
                <HomePage onSubmit={handleSetUserName} initialUserName={userName} />
            }
          />
          <Route
            path="/chats"
            element={
              isUserNameSet ?
                <ChatsPage userName={userName} onLogout={handleLogout} /> :
                <Navigate to="/" />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
