import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { GlassPanel, GlassButton } from '@/components/ui/glassmorphism';
import ChatRoom from '@/components/chat/ChatRoom';
import RoomList from '@/components/sidebar/RoomList';
import UserProfile from '@/components/sidebar/UserProfile';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
      {/* Sidebar */}
      <div 
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          w-80 h-full transition-transform duration-300 ease-in-out
        `}
      >
        <GlassPanel className="h-full p-4 overflow-y-auto" intensity="medium">
          <UserProfile />
          <RoomList />
        </GlassPanel>
      </div>

      {/* Mobile sidebar toggle */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <GlassPanel className="m-4 flex-1 overflow-hidden" intensity="light">
          <ChatRoom />
        </GlassPanel>
      </div>
    </div>
  );
};

export default AppLayout;
