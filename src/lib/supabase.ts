import { createClient } from '@supabase/supabase-js';
import { User, Room, Message } from '@/types';
import { isValidUUID, generateUUID, COMMUNITY_ROOM_ID } from '@/lib/uuidHelpers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  
  if (error) throw error;
  
  // User profile will be automatically created by the database trigger
  // But we can update status if needed
  if (data.user) {
    await updateUserStatus(data.user.id, 'online');
  }
  
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Update user status to online
  if (data.user) {
    await updateUserStatus(data.user.id, 'online');
  }
  
  return data;
};

export const signOut = async () => {
  // Get current user to update status before signing out
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await updateUserStatus(user.id, 'offline');
  }
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// User functions
export const createUserProfile = async (user: Partial<User>) => {
  if (!user.id || !isValidUUID(user.id)) {
    throw new Error('Invalid user ID format');
  }
  
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserStatus = async (userId: string, status: User['status']) => {
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  const { error } = await supabase
    .from('users')
    .update({ 
      status, 
      last_seen: new Date().toISOString() 
    })
    .eq('id', userId);
  
  if (error) throw error;
};

// Room functions
export const getRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createRoom = async (room: Partial<Room>) => {
  const roomData = {
    ...room,
    id: room.id || generateUUID(),
    type: room.type || 'private'
  };
  
  if (room.createdBy && !isValidUUID(room.createdBy)) {
    throw new Error('Invalid creator ID format');
  }
  
  const { data, error } = await supabase
    .from('rooms')
    .insert(roomData)
    .select()
    .single();
  
  if (error) throw error;
  
  // Add creator as participant if specified
  if (data && room.createdBy) {
    await addRoomParticipant(data.id, room.createdBy);
  }
  
  return data;
};

export const addRoomParticipant = async (roomId: string, userId: string) => {
  if (!isValidUUID(roomId) || !isValidUUID(userId)) {
    throw new Error('Invalid UUID format');
  }
  
  const { error } = await supabase
    .from('room_participants')
    .insert({ room_id: roomId, user_id: userId });
  
  if (error) throw error;
};

export const removeRoomParticipant = async (roomId: string, userId: string) => {
  if (!isValidUUID(roomId) || !isValidUUID(userId)) {
    throw new Error('Invalid UUID format');
  }
  
  const { error } = await supabase
    .from('room_participants')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);
  
  if (error) throw error;
};

export const getRoomParticipants = async (roomId: string) => {
  if (!isValidUUID(roomId)) {
    throw new Error('Invalid room ID format');
  }
  
  const { data, error } = await supabase
    .from('room_participants')
    .select(`
      user_id,
      joined_at,
      users!inner(*)
    `)
    .eq('room_id', roomId);
  
  if (error) throw error;
  return data;
};

// Message functions
export const getMessages = async (roomId: string) => {
  if (!isValidUUID(roomId)) {
    throw new Error('Invalid room ID format');
  }
  
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      users!inner(
        id,
        name,
        avatar
      )
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const sendMessage = async (message: Partial<Message>) => {
  const messageData = {
    ...message,
    id: message.id || generateUUID(),
    type: message.type || 'text',
    read: false
  };
  
  if (message.roomId && !isValidUUID(message.roomId)) {
    throw new Error('Invalid room ID format');
  }
  
  if (message.senderId && !isValidUUID(message.senderId)) {
    throw new Error('Invalid sender ID format');
  }
  
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select(`
      *,
      users!inner(
        id,
        name,
        avatar
      )
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const markMessageAsRead = async (messageId: string) => {
  if (!isValidUUID(messageId)) {
    throw new Error('Invalid message ID format');
  }
  
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);
  
  if (error) throw error;
};

// Reaction functions
export const addMessageReaction = async (messageId: string, userId: string, emoji: string) => {
  if (!isValidUUID(messageId) || !isValidUUID(userId)) {
    throw new Error('Invalid UUID format');
  }
  
  const { error } = await supabase
    .from('message_reactions')
    .insert({ 
      message_id: messageId, 
      user_id: userId, 
      emoji 
    });
  
  if (error) throw error;
};

export const removeMessageReaction = async (messageId: string, userId: string, emoji: string) => {
  if (!isValidUUID(messageId) || !isValidUUID(userId)) {
    throw new Error('Invalid UUID format');
  }
  
  const { error } = await supabase
    .from('message_reactions')
    .delete()
    .eq('message_id', messageId)
    .eq('user_id', userId)
    .eq('emoji', emoji);
  
  if (error) throw error;
};

export const getMessageReactions = async (messageId: string) => {
  if (!isValidUUID(messageId)) {
    throw new Error('Invalid message ID format');
  }
  
  const { data, error } = await supabase
    .from('message_reactions')
    .select('*')
    .eq('message_id', messageId);
  
  if (error) throw error;
  return data;
};

// Real-time subscriptions
export const subscribeToMessages = (roomId: string, callback: (message: Message) => void) => {
  if (!isValidUUID(roomId)) {
    throw new Error('Invalid room ID format');
  }
  
  return supabase
    .channel(`messages:${roomId}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'messages',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      callback(payload.new as Message);
    })
    .subscribe();
};

export const subscribeToRooms = (callback: (room: Room) => void) => {
  return supabase
    .channel('rooms')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'rooms'
    }, (payload) => {
      callback(payload.new as Room);
    })
    .subscribe();
};

export const subscribeToUserStatus = (callback: (user: User) => void) => {
  return supabase
    .channel('user_status')
    .on('postgres_changes', { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'users'
    }, (payload) => {
      callback(payload.new as User);
    })
    .subscribe();
};

export const subscribeToRoomParticipants = (roomId: string, callback: (participant: any) => void) => {
  if (!isValidUUID(roomId)) {
    throw new Error('Invalid room ID format');
  }
  
  return supabase
    .channel(`room_participants:${roomId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'room_participants',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      callback(payload);
    })
    .subscribe();
};

// Utility function to join community room automatically
export const joinCommunityRoom = async (userId: string) => {
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  try {
    await addRoomParticipant(COMMUNITY_ROOM_ID, userId);
  } catch (error) {
    // Ignore if already a participant
    if (error.code !== '23505') {
      throw error;
    }
  }
};