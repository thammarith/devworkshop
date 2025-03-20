import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Message } from '../../../schema/models';
import { db } from './config';

export const sendMessage = async (chatId: string, content: string, userName: string): Promise<void> => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');

  const messageData: Omit<Message, 'id'> = {
    content,
    created_at: serverTimestamp() as Timestamp,
    user_name: userName,
  };

  await addDoc(messagesRef, messageData);

  // Update the chat's updated_at field
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    updated_at: serverTimestamp()
  });
};

export const listenToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const messagesQuery = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('created_at', 'asc')
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));

    callback(messages);
  });
};
