// This file is maintained for backward compatibility
// It now re-exports everything from the new modular structure
// Re-export all Firebase functionality
export { db } from "./firebase/config";
export {
  createChat,
  getChats,
  listenToChats,
  deleteChat,
  renameChat,
} from "./firebase/chats";
export { sendMessage, listenToMessages } from "./firebase/messages";

