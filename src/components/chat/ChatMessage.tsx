import React from 'react';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/glassmorphism';
import { Message, User } from '@/types';
import { format } from 'date-fns';
import EmojiReaction from './EmojiReaction';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  sender: User | undefined;
  currentUser: User;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isCurrentUser, 
  sender, 
  currentUser,
  onAddReaction 
}) => {
  const { content, timestamp, type } = message;
  
  return (
    <div className={cn(
      'flex mb-4',
      isCurrentUser ? 'justify-end' : 'justify-start'
    )}>
      {!isCurrentUser && sender && (
        <div className="flex-shrink-0 mr-2">
          <img 
            src={sender.avatar || 'https://via.placeholder.com/40'} 
            alt={sender.name} 
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
      
      <div className={cn(
        'max-w-[70%]',
        isCurrentUser ? 'items-end' : 'items-start'
      )}>
        {!isCurrentUser && sender && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {sender.name}
          </div>
        )}
        
        <GlassPanel
          intensity={isCurrentUser ? 'medium' : 'light'}
          className={cn(
            'px-4 py-2',
            isCurrentUser ? 'bg-blue-500/50 text-white' : 'bg-white/50 dark:bg-gray-800/50',
          )}
        >
          {type === 'text' && <div>{content}</div>}
          {type === 'image' && (
            <img src={content} alt="Image message" className="max-w-full rounded" />
          )}
          {type === 'voice' && (
            <div className="flex items-center">
              <button className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
              <div className="w-32 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          )}
        </GlassPanel>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {format(new Date(timestamp), 'p')}
          </div>
          
          <EmojiReaction 
            message={message} 
            currentUser={currentUser} 
            onAddReaction={onAddReaction} 
          />
        </div>
      </div>
      
      {isCurrentUser && (
        <div className="flex-shrink-0 ml-2">
          <img 
            src={sender?.avatar || 'https://via.placeholder.com/40'} 
            alt={sender?.name || 'You'} 
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
