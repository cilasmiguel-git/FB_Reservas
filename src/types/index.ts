export interface Room {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  imageHint: string;
  availableNow: boolean;
  statusText: string;
  statusColorClass: string; // e.g., 'text-green-500' or 'text-red-500' using accent/destructive theme colors
  floor: string;
  type: string;
}

export interface BookingRequest {
  id: string;
  roomName: string;
  roomId: string;
  date: string;
  time: string;
  purpose: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
}

export interface SuggestedRoom {
  name: string;
  capacity: number;
  availability: string;
}
