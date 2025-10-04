// Message operations
export type MessageType = 'text' | 'image' | 'video' | 'document' | 'audio';

export interface CreateMessageData {
  roomId: string;
  senderId: string;
  messageBody: string;
  media?: string | null;
  type?: MessageType;
  timestamp?: Date | any;
  readReceipt?: boolean;
}