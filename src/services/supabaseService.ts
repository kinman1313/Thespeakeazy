import { supabase } from '@/lib/supabase';
import { User, Room, Message } from '@/types';

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
  
  // Create user profile if signup successful
  if (data.user) {
    await createUserProfile({
      id: data.user.id,
      name,
      email,
      status: 'online'
    });
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
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// User functions
export const createUserProfile = async (user: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserStatus = async (userId: string, status: User['status']) => {
  const { error } = await supabase
    .from('users')
    .update({ status, last_seen: new Date() })
    .eq('id', userId);
  
  if (error) throw error;
};

// Room functions
export const getRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const createRoom = async (room: Partial<Room>) => {
  const { data, error } = await supabase
    .from('rooms')
    .insert(room)
    .select()
    .single();
  
  if (error) throw error;
  
  // Add creator as participant
  if (data && room.created_by) {
    await addRoomParticipant(data.id, room.created_by);
  }
  
  return data;
};

export const addRoomParticipant = async (roomId: string, userId: string) => {
  const { error } = await supabase
    .from('room_participants')
    .insert({ room_id: roomId, user_id: userId });
  
  if (error) throw error;
};

// Message functions
export const getMessages = async (roomId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const sendMessage = async (message: Partial<Message>) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Real-time subscriptions
export const subscribeToMessages = (roomId: string, callback: (message: Message) => void) => {
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
