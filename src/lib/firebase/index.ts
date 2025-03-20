// Re-export all Firebase functionality
export { db } from './config';
export { createChat, getChats, listenToChats } from './chats';
export { sendMessage, listenToMessages } from './messages';
