export interface Message {
  id: number;
  text: string;
  time: string;
  isOutgoing: boolean;
  isRead: boolean;
  timestamp?: Date;
  attachments?: string[];
}
