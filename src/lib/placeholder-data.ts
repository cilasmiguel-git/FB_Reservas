import type { Room, BookingRequest } from '@/types';

export const placeholderRooms: Room[] = [
  {
    id: '1',
    name: 'Sala de Reuniões A',
    capacity: 10,
    amenities: ['Projetor', 'Quadro Branco', 'Wi-Fi'],
    imageUrl: 'https://picsum.photos/400/300?random=1',
    imageHint: 'meeting room',
    availableNow: true,
    statusText: 'Disponível',
    statusColorClass: 'text-accent',
    floor: "1º Andar",
    type: "Reunião"
  },
  {
    id: '2',
    name: 'Laboratório de Informática B',
    capacity: 25,
    amenities: ['Computadores', 'Projetor', 'Internet Cabeada'],
    imageUrl: 'https://picsum.photos/400/300?random=2',
    imageHint: 'computer lab',
    availableNow: false,
    statusText: 'Ocupada',
    statusColorClass: 'text-destructive',
    floor: "2º Andar",
    type: "Laboratório"
  },
  {
    id: '3',
    name: 'Auditório Principal',
    capacity: 100,
    amenities: ['Palco', 'Sistema de Som', 'Projetor Grande'],
    imageUrl: 'https://picsum.photos/400/300?random=3',
    imageHint: 'auditorium',
    availableNow: true,
    statusText: 'Disponível',
    statusColorClass: 'text-accent',
    floor: "Térreo",
    type: "Auditório"
  },
  {
    id: '4',
    name: 'Sala de Aula 101',
    capacity: 30,
    amenities: ['Quadro Interativo', 'Wi-Fi'],
    imageUrl: 'https://picsum.photos/400/300?random=4',
    imageHint: 'classroom',
    availableNow: false,
    statusText: 'Em manutenção',
    statusColorClass: 'text-muted-foreground',
    floor: "1º Andar",
    type: "Sala de Aula"
  },
];

export const placeholderBookings: BookingRequest[] = [
  {
    id: 'b1',
    roomId: '1',
    roomName: 'Sala de Reuniões A',
    date: '2024-08-15',
    time: '14:00 - 16:00',
    purpose: 'Reunião de Departamento',
    status: 'Aprovada',
  },
  {
    id: 'b2',
    roomId: '3',
    roomName: 'Auditório Principal',
    date: '2024-08-20',
    time: '09:00 - 12:00',
    purpose: 'Palestra sobre IA',
    status: 'Pendente',
  },
  {
    id: 'b3',
    roomId: '2',
    roomName: 'Laboratório de Informática B',
    date: '2024-08-10',
    time: '10:00 - 11:30',
    purpose: 'Aula Prática de Programação',
    status: 'Rejeitada',
  },
];
