import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Message, Room } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  rooms: Room[];
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  messages: Message[];
  sendMessage: (content: string, roomId: string, type: Message['type']) => void;
  createRoom: (name: string, type: Room['type'], participants: string[]) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  addReaction: (messageId: string, emoji: string) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  users: [],
  rooms: [],
  currentRoom: null,
  setCurrentRoom: () => {},
  messages: [],
  sendMessage: () => {},
  createRoom: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  notificationsEnabled: true,
  toggleNotifications: () => {},
  soundEnabled: true,
  toggleSound: () => {},
  addReaction: () => {}
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', status: 'online', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', status: 'offline', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', name: 'Bob Johnson', status: 'away', avatar: 'https://i.pravatar.cc/150?img=8' },
];

const mockRooms: Room[] = [
  { 
    id: 'community', 
    name: 'Community Lobby', 
    type: 'community', 
    participants: ['1', '2', '3'], 
    createdBy: '1',
    createdAt: new Date()
  },
  { 
    id: 'private1', 
    name: 'Design Team', 
    type: 'private', 
    participants: ['1', '2'], 
    createdBy: '1',
    createdAt: new Date()
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Welcome to the community lobby!',
    senderId: '1',
    roomId: 'community',
    timestamp: new Date(),
    type: 'text',
    read: true,
    reactions: { '👍': ['2'], '❤️': ['3'] }
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // Auto-login for demo
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(mockRooms[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const sendMessage = (content: string, roomId: string, type: Message['type'] = 'text') => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: currentUser.id,
      roomId,
      timestamp: new Date(),
      type,
      read: false,
      reactions: {}
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    
    setMessages(prev => 
      prev.map(message => {
        if (message.id === messageId) {
          // Initialize reactions object if it doesn't exist
          const reactions = message.reactions || {};
          
          // Initialize emoji array if it doesn't exist
          const emojiUsers = reactions[emoji] || [];
          
          // Check if user already reacted with this emoji
          const userIndex = emojiUsers.indexOf(currentUser.id);
          
          if (userIndex >= 0) {
            // Remove user's reaction if they already reacted with this emoji
            const newEmojiUsers = [...emojiUsers];
            newEmojiUsers.splice(userIndex, 1);
            
            return {
              ...message,
              reactions: {
                ...reactions,
                [emoji]: newEmojiUsers
              }
            };
          } else {
            // Add user's reaction
            return {
              ...message,
              reactions: {
                ...reactions,
                [emoji]: [...emojiUsers, currentUser.id]
              }
            };
          }
        }
        return message;
      })
    );
  };

  const createRoom = (name: string, type: Room['type'], participants: string[]) => {
    if (!currentUser) return;
    
    const newRoom: Room = {
      id: Date.now().toString(),
      name,
      type,
      participants: [...participants, currentUser.id],
      createdBy: currentUser.id,
      createdAt: new Date()
    };

    setRooms(prev => [...prev, newRoom]);
    setCurrentRoom(newRoom);
  };

  const joinRoom = (roomId: string) => {
    if (!currentUser) return;
    
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, participants: [...room.participants, currentUser.id] }
          : room
      )
    );
  };

  const leaveRoom = (roomId: string) => {
    if (!currentUser) return;
    
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, participants: room.participants.filter(id => id !== currentUser.id) }
          : room
      )
    );

    if (currentRoom?.id === roomId) {
      setCurrentRoom(rooms.find(room => room.id === 'community') || null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentUser,
        setCurrentUser,
        users,
        rooms,
        currentRoom,
        setCurrentRoom,
        messages,
        sendMessage,
        createRoom,
        joinRoom,
        leaveRoom,
        notificationsEnabled,
        toggleNotifications,
        soundEnabled,
        toggleSound,
        addReaction
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
