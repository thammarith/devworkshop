// Re-export all Firebase functionality
export { db } from "./config";
export {
  createChat,
  getChats,
  listenToChats,
  deleteChat,
  renameChat,
} from "./chats";
export { sendMessage, listenToMessages } from "./messages";
