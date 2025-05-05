import React, { useEffect, useRef } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { GlassPanel } from '@/components/ui/glassmorphism';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import VideoCallButton from '../video/VideoCallButton';
import VideoCallModal from '../video/VideoCallModal';

const ChatRoom: React.FC = () => {
  const { 
    currentUser, 
    currentRoom, 
    messages, 
    sendMessage, 
    users,
    addReaction
  } = useAppContext();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Filter messages for the current room
  const roomMessages = messages.filter(
    message => message.roomId === currentRoom?.id
  );
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);
  
  const handleSendMessage = (content: string, type: 'text' | 'image' | 'voice' | 'video') => {
    if (currentRoom) {
      sendMessage(content, currentRoom.id, type);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji);
  };
  
  if (!currentRoom || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a room to start chatting</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Room header */}
      <GlassPanel className="p-4 flex items-center">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{currentRoom.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentRoom.type === 'community' ? 'Community Room' : 
             currentRoom.type === 'private' ? 'Private Room' : 'Direct Message'}
            {' • '}
            {currentRoom.participants.length} participants
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Call buttons */}
          <VideoCallButton callType="audio" />
          <VideoCallButton callType="video" />
        </div>
      </GlassPanel>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {roomMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          roomMessages.map(message => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = users.find(user => user.id === message.senderId);
            
            return (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isCurrentUser={isCurrentUser} 
                sender={sender}
                currentUser={currentUser}
                onAddReaction={handleAddReaction}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} />
      
      {/* Video call modal - will only render when in a call */}
      <VideoCallModal />
    </div>
  );
};

export default ChatRoom;
