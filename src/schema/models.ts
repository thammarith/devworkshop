import { Timestamp } from 'firebase/firestore';

// Firestore collections
export interface Message {
    id: string;
    content: string;
    created_at: Timestamp;
    user_name?: string; // Optional user name for display
}

export interface Chat {
    id: string;
    name: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    participants: string[]; // Array of user IDs
}

// For frontend state management
export interface ChatWithMessages extends Chat {
    messages: Message[];
}
