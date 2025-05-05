// src/lib/uuidHelpers.ts

// UUID v4 generator
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Validate UUID format
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Constants for known UUIDs
export const COMMUNITY_ROOM_ID = '00000000-0000-0000-0000-000000000001';

// Type guard for UUID
export function isUUID(value: any): value is string {
  return typeof value === 'string' && isValidUUID(value);
}