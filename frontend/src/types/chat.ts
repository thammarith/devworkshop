import { Timestamp } from "firebase/firestore";

// Firestore collections
export interface Message {
  id: string;
  content: string;
  created_at: Timestamp;
  username: string; // Optional user name for display
  role: "user" | "assistant"; // Role of the sender
}

export interface Chat {
  id: string;
  name: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  participants: Record<string, boolean>; // Map of usernames to boolean values
}

// For frontend state management
export interface ChatWithMessages extends Chat {
  messages: Message[];
}
