import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { GlassPanel, GlassButton } from '@/components/ui/glassmorphism';
import { Room } from '@/types';
import { format } from 'date-fns';

const RoomList: React.FC = () => {
  const { rooms, currentRoom, setCurrentRoom, currentUser } = useAppContext();
  
  // Sort rooms: community first, then by last message time
  const sortedRooms = [...rooms].sort((a, b) => {
    // Community room always first
    if (a.type === 'community') return -1;
    if (b.type === 'community') return 1;
    
    // Then sort by last message time if available
    if (a.lastMessage && b.lastMessage) {
      return new Date(b.lastMessage.timestamp).getTime() - 
             new Date(a.lastMessage.timestamp).getTime();
    }
    
    // Otherwise sort by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const handleRoomClick = (room: Room) => {
    setCurrentRoom(room);
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Rooms</h2>
        <GlassButton
          variant="primary"
          className="text-xs px-2 py-1"
          onClick={() => {
            // In a real app, this would open a modal to create a room
            alert('Create room functionality would open here');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New
        </GlassButton>
      </div>
      
      <div className="space-y-2">
        {sortedRooms.map(room => {
          const isActive = currentRoom?.id === room.id;
          const hasUnread = room.lastMessage && !room.lastMessage.read && 
                           room.lastMessage.senderId !== currentUser?.id;
          
          return (
            <GlassPanel
              key={room.id}
              className={`p-3 cursor-pointer transition-all ${isActive ? 'border-blue-500 bg-blue-500/10' : ''}`}
              onClick={() => handleRoomClick(room)}
              intensity={isActive ? 'medium' : 'light'}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {room.type === 'community' ? (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                  ) : room.type === 'private' ? (
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium truncate">{room.name}</h3>
                    <span className="text-xs text-gray-500">
                      {room.lastMessage ? 
                        format(new Date(room.lastMessage.timestamp), 'p') : 
                        format(new Date(room.createdAt), 'MMM d')}
                    </span>
                  </div>
                  
                  {room.lastMessage && (
                    <p className={`text-xs truncate ${hasUnread ? 'font-semibold' : 'text-gray-500'}`}>
                      {room.lastMessage.type === 'text' ? 
                        room.lastMessage.content : 
                        room.lastMessage.type === 'image' ? 
                          '🖼️ Image' : 
                          room.lastMessage.type === 'voice' ? 
                            '🎤 Voice message' : 
                            '📹 Video'}
                    </p>
                  )}
                </div>
                
                {hasUnread && (
                  <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};

export default RoomList;
