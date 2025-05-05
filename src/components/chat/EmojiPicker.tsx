import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Common emoji categories
  const emojiCategories = [
    {
      name: 'Smileys',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘']
    },
    {
      name: 'Gestures',
      emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '✋', '🤚', '🖐️', '👋', '🙏']
    },
    {
      name: 'Objects',
      emojis: ['❤️', '🔥', '⭐', '🎁', '🎉', '🎈', '✨', '🎵', '🎸', '📱', '💻', '⌚', '📷', '🔋', '💡', '🔍', '🔒']
    }
  ];

  // Filter emojis based on search term
  const filteredCategories = searchTerm
    ? emojiCategories.map(category => ({
        name: category.name,
        emojis: category.emojis.filter(emoji => 
          emoji.includes(searchTerm) || category.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.emojis.length > 0)
    : emojiCategories;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
          title="Emoji picker"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search emojis..."
            className="w-full p-2 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredCategories.map((category) => (
            <div key={category.name} className="mb-2">
              <h3 className="text-sm font-medium mb-1">{category.name}</h3>
              <div className="grid grid-cols-7 gap-1">
                {category.emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xl"
                    onClick={() => onEmojiSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;