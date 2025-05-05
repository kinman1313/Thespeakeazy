import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useVideoCall } from '@/contexts/VideoCallContext';
import { useAppContext } from '@/contexts/AppContext';
import VideoParticipant from './VideoParticipant';
import VideoControls from './VideoControls';

const VideoCallModal: React.FC = () => {
  const { callState, localStream, remoteStreams, isAudioMuted, isVideoOff, endCall } = useVideoCall();
  const { users, currentUser } = useAppContext();

  // If not in a call, don't render anything
  if (!callState.isInCall) {
    return null;
  }

  // Find participants in the call
  const participantUsers = callState.participants
    .map(id => users.find(user => user.id === id))
    .filter(Boolean);

  return (
    <Dialog open={callState.isInCall} onOpenChange={(open) => !open && endCall()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 bg-gray-900 border-gray-800">
        <div className="flex flex-col h-[80vh] p-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto p-2">
            {/* Local participant */}
            {currentUser && (
              <VideoParticipant
                stream={localStream}
                user={currentUser}
                isLocal={true}
                isVideoOff={callState.callType === 'audio' || isVideoOff}
                className="w-full h-full min-h-[200px]"
              />
            )}

            {/* Remote participants */}
            {Object.entries(remoteStreams).map(([userId, stream]) => {
              const user = users.find(u => u.id === userId);
              return (
                <VideoParticipant
                  key={userId}
                  stream={stream}
                  user={user || null}
                  className="w-full h-full min-h-[200px]"
                />
              );
            })}

            {/* Empty placeholders for users without streams yet */}
            {participantUsers
              .filter(user => user && user.id !== currentUser?.id && !remoteStreams[user.id])
              .map(user => (
                <VideoParticipant
                  key={user!.id}
                  stream={null}
                  user={user || null}
                  className="w-full h-full min-h-[200px]"
                />
              ))}
          </div>

          {/* Call controls */}
          <VideoControls className="mt-4" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
