export interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice' | 'video';
  roomId: string;
  read: boolean;
  reactions?: { [emoji: string]: string[] }; // userId[] who reacted with this emoji
}

export interface Room {
  id: string;
  name: string;
  type: 'community' | 'private' | 'direct';
  participants: string[]; // userId[]
  createdBy: string; // userId
  createdAt: Date;
  lastMessage?: Message;
}

export interface VideoCallState {
  isInCall: boolean;
  callType: 'video' | 'audio';
  roomId: string | null;
  participants: string[];
  initiator: string | null;
}
