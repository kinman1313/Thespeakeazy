import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { GlassPanel, GlassButton } from '@/components/ui/glassmorphism';
import { LogOut } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { 
    currentUser, 
    notificationsEnabled, 
    toggleNotifications, 
    soundEnabled, 
    toggleSound,
    logout 
  } = useAppContext();
  
  if (!currentUser) return null;
  
  return (
    <GlassPanel className="p-3 mb-4">
      <div className="flex items-center">
        <img 
          src={currentUser.avatar || 'https://via.placeholder.com/40'} 
          alt={currentUser.name} 
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <h3 className="font-medium">{currentUser.name}</h3>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-1 ${currentUser.status === 'online' ? 'bg-green-500' : currentUser.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
            <span className="text-xs text-gray-500 capitalize">{currentUser.status}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between">
        <button 
          onClick={toggleNotifications}
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${notificationsEnabled ? 'text-blue-500' : 'text-gray-500'}`}
          title={notificationsEnabled ? 'Notifications on' : 'Notifications off'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        
        <button 
          onClick={toggleSound}
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${soundEnabled ? 'text-blue-500' : 'text-gray-500'}`}
          title={soundEnabled ? 'Sound on' : 'Sound off'}
        >
          {soundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>
        
        <button 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        
        <button 
          onClick={logout}
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </GlassPanel>
  );
};

export default UserProfile;