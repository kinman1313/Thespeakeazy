import React, { useRef, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { User } from '@/types';

interface VideoParticipantProps {
  stream: MediaStream | null;
  user: User | null;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isLocal?: boolean;
  className?: string;
}

const VideoParticipant: React.FC<VideoParticipantProps> = ({
  stream,
  user,
  isMuted = false,
  isVideoOff = false,
  isLocal = false,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Connect stream to video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative rounded-lg overflow-hidden bg-gray-900 ${className}`}>
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal || isMuted} // Always mute local video to prevent feedback
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <Avatar className="w-20 h-20">
            <div className="flex items-center justify-center w-full h-full bg-primary text-2xl font-semibold text-primary-foreground">
              {user?.name?.charAt(0) || '?'}
            </div>
          </Avatar>
        </div>
      )}

      {/* User info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">
            {user?.name || 'Unknown'} {isLocal && '(You)'}
          </span>
          {isMuted && (
            <span className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoParticipant;
