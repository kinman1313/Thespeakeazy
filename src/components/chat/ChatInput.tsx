import React, { useState, useRef } from 'react';
import { GlassInput, GlassButton } from '@/components/ui/glassmorphism';
import { useAppContext } from '@/contexts/AppContext';
import EmojiPicker from './EmojiPicker';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'voice' | 'video') => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { soundEnabled } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
      
      if (soundEnabled) {
        // Play send sound
        const audio = new Audio('/sounds/send.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // Here we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      onSendMessage(imageUrl, 'image');
    }
  };
  
  const handleVoiceMessage = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording
      // In a real app, you would use the MediaRecorder API
      console.log('Started recording');
    } else {
      // Stop recording and send
      console.log('Stopped recording');
      // Simulating a voice message
      onSendMessage('voice-message-url', 'voice');
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    // Focus the input after selecting an emoji
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
          title="Upload image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileUpload} 
        />
        
        <button 
          onClick={handleVoiceMessage}
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 ${isRecording ? 'text-red-500' : ''}`}
          title={isRecording ? 'Stop recording' : 'Record voice message'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>
        
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        
        <GlassInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-grow"
          ref={inputRef}
        />
        
        <GlassButton 
          onClick={handleSendMessage}
          disabled={!message.trim()}
          variant="primary"
          className="ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </GlassButton>
      </div>
    </div>
  );
};

export default ChatInput;
