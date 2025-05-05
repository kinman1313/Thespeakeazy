import React from 'react';
import { Button } from '@/components/ui/button';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { useAppContext } from '@/contexts/AppContext';
import { Video, Phone } from 'lucide-react';

interface VideoCallButtonProps {
  callType: 'video' | 'audio';
  className?: string;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({ callType, className = '' }) => {
  const { startCall, callState } = useVideoCall();
  const { currentRoom } = useAppContext();

  const handleStartCall = () => {
    if (currentRoom) {
      startCall(currentRoom.id, callType);
    }
  };

  // Disable button if already in a call
  const isDisabled = callState.isInCall;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
      onClick={handleStartCall}
      disabled={isDisabled}
      title={callType === 'video' ? 'Start video call' : 'Start audio call'}
    >
      {callType === 'video' ? (
        <Video size={20} />
      ) : (
        <Phone size={20} />
      )}
    </Button>
  );
};

export default VideoCallButton;
