import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { Chat } from '../../../schema/models';
import { db } from './config';

export const createChat = async (name: string, userName: string): Promise<string> => {
  const chatData: Omit<Chat, 'id'> = {
    name,
    created_at: serverTimestamp() as Timestamp,
    updated_at: serverTimestamp() as Timestamp,
    participants: [userName],
  };

  const chatRef = await addDoc(collection(db, 'chats'), chatData);
  return chatRef.id;
};

export const getChats = async (): Promise<Chat[]> => {
  const chatsQuery = query(collection(db, 'chats'), orderBy('updated_at', 'desc'));
  const snapshot = await getDocs(chatsQuery);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Chat));
};

export const listenToChats = (callback: (chats: Chat[]) => void) => {
  const chatsQuery = query(collection(db, 'chats'), orderBy('updated_at', 'desc'));

  return onSnapshot(chatsQuery, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Chat));

    callback(chats);
  });
};
