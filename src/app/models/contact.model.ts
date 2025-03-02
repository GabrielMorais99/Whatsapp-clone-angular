export interface Contact {
  id: number;
  name: string;
  profilePic?: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline?: boolean;
  lastSeen?: string;
  status?: string;
}
