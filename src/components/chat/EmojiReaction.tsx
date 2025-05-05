import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Message, User } from '@/types';

interface EmojiReactionProps {
  message: Message;
  currentUser: User;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '👏', '🔥'];

const EmojiReaction: React.FC<EmojiReactionProps> = ({ message, currentUser, onAddReaction }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleReaction = (emoji: string) => {
    onAddReaction(message.id, emoji);
    setIsOpen(false);
  };
  
  // Count total reactions
  const totalReactions = message.reactions ? 
    Object.values(message.reactions).reduce((sum, users) => sum + users.length, 0) : 0;
  
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {/* Quick reaction button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button 
            className="text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-0.5"
            aria-label="Add reaction"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              {totalReactions > 0 ? totalReactions : ''}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1" side="top">
          <div className="flex space-x-1">
            {COMMON_REACTIONS.map(emoji => (
              <button
                key={emoji}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Display existing reactions */}
      {message.reactions && Object.entries(message.reactions).map(([emoji, userIds]) => {
        if (userIds.length === 0) return null;
        
        const hasReacted = userIds.includes(currentUser.id);
        
        return (
          <button
            key={emoji}
            className={`text-xs rounded-full px-2 py-0.5 flex items-center ${hasReacted ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}
            onClick={() => handleReaction(emoji)}
          >
            <span className="mr-1">{emoji}</span>
            <span>{userIds.length}</span>
          </button>
        );
      })}
    </div>
  );
};

export default EmojiReaction;