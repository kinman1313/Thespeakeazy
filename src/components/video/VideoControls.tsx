import React from 'react';
import { Button } from '@/components/ui/button';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface VideoControlsProps {
  className?: string;
}

const VideoControls: React.FC<VideoControlsProps> = ({ className = '' }) => {
  const { 
    endCall, 
    toggleMute, 
    toggleVideo, 
    isAudioMuted, 
    isVideoOff,
    callState
  } = useVideoCall();

  return (
    <div className={`flex items-center justify-center gap-4 p-4 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className={`rounded-full ${isAudioMuted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'}`}
        onClick={toggleMute}
        title={isAudioMuted ? 'Unmute' : 'Mute'}
      >
        {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>

      {callState.callType === 'video' && (
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${isVideoOff ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'}`}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </Button>
      )}

      <Button
        variant="destructive"
        size="icon"
        className="rounded-full bg-red-500 hover:bg-red-600"
        onClick={endCall}
        title="End call"
      >
        <PhoneOff size={20} />
      </Button>
    </div>
  );
};

export default VideoControls;
