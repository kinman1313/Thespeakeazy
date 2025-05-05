import { supabase } from '@/lib/supabase';

/**
 * Create a new video call record in the database
 */
export const createVideoCall = async (roomId: string, initiatorId: string, callType: 'video' | 'audio') => {
  const { data, error } = await supabase
    .from('video_calls')
    .insert({
      room_id: roomId,
      initiator_id: initiatorId,
      call_type: callType,
      participants: [initiatorId]
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating video call:', error);
    throw error;
  }

  return data;
};

/**
 * Update participants in a video call
 */
export const updateVideoCallParticipants = async (callId: string, participants: string[]) => {
  const { data, error } = await supabase
    .from('video_calls')
    .update({
      participants
    })
    .eq('id', callId)
    .select()
    .single();

  if (error) {
    console.error('Error updating video call participants:', error);
    throw error;
  }

  return data;
};

/**
 * End a video call by setting the ended_at timestamp
 */
export const endVideoCall = async (callId: string) => {
  const { data, error } = await supabase
    .from('video_calls')
    .update({
      ended_at: new Date().toISOString()
    })
    .eq('id', callId)
    .select()
    .single();

  if (error) {
    console.error('Error ending video call:', error);
    throw error;
  }

  return data;
};
