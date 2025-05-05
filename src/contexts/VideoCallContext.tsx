import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAppContext } from './AppContext';
import { VideoCallState } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface VideoCallContextType {
  callState: VideoCallState;
  localStream: MediaStream | null;
  remoteStreams: Record<string, MediaStream>;
  startCall: (roomId: string, callType: 'video' | 'audio') => Promise<void>;
  joinCall: (roomId: string) => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  isAudioMuted: boolean;
  isVideoOff: boolean;
}

const defaultVideoCallContext: VideoCallContextType = {
  callState: {
    isInCall: false,
    callType: 'video',
    roomId: null,
    participants: [],
    initiator: null
  },
  localStream: null,
  remoteStreams: {},
  startCall: async () => {},
  joinCall: async () => {},
  endCall: () => {},
  toggleMute: () => {},
  toggleVideo: () => {},
  isAudioMuted: false,
  isVideoOff: false
};

const VideoCallContext = createContext<VideoCallContextType>(defaultVideoCallContext);

export const useVideoCall = () => useContext(VideoCallContext);

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentRoom } = useAppContext();
  const [callState, setCallState] = useState<VideoCallState>(defaultVideoCallContext.callState);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Cleanup function for media streams
  const cleanupMediaStreams = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Clear remote streams
    Object.values(remoteStreams).forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    setRemoteStreams({});
  };

  // Start a new call
  const startCall = async (roomId: string, callType: 'video' | 'audio') => {
    if (!currentUser) return;
    
    try {
      // Request media permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });
      
      setLocalStream(stream);
      
      // Update call state
      setCallState({
        isInCall: true,
        callType,
        roomId,
        participants: [currentUser.id],
        initiator: currentUser.id
      });
      
      toast({
        title: 'Call started',
        description: `You started a ${callType} call`
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: 'Call failed',
        description: 'Could not access camera or microphone',
        variant: 'destructive'
      });
    }
  };

  // Join an existing call
  const joinCall = async (roomId: string) => {
    if (!currentUser) return;
    
    try {
      // Get call type from current call state
      const callType = callState.callType;
      
      // Request media permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });
      
      setLocalStream(stream);
      
      // Update call state
      setCallState(prev => ({
        ...prev,
        isInCall: true,
        roomId,
        participants: [...prev.participants, currentUser.id]
      }));
      
      toast({
        title: 'Call joined',
        description: `You joined a ${callType} call`
      });
    } catch (error) {
      console.error('Error joining call:', error);
      toast({
        title: 'Call failed',
        description: 'Could not access camera or microphone',
        variant: 'destructive'
      });
    }
  };

  // End current call
  const endCall = () => {
    cleanupMediaStreams();
    
    setCallState(defaultVideoCallContext.callState);
    
    toast({
      title: 'Call ended',
      description: 'You left the call'
    });
  };

  // Toggle audio mute
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMediaStreams();
    };
  }, []);

  return (
    <VideoCallContext.Provider
      value={{
        callState,
        localStream,
        remoteStreams,
        startCall,
        joinCall,
        endCall,
        toggleMute,
        toggleVideo,
        isAudioMuted,
        isVideoOff
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
