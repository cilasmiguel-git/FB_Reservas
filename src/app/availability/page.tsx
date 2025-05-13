import RoomCard from '@/components/room-card';
import { placeholderRooms } from '@/lib/placeholder-data';
import type { Room } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

// This would typically come from a server-side fetch or state management
const rooms: Room[] = placeholderRooms;

export default function AvailabilityPage() {
  // TODO: Implement actual filtering logic
  // For now, search and filters are just UI elements

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Disponibilidade de Salas</h1>
        <p className="text-muted-foreground">
          Encontre a sala perfeita para sua próxima aula, reunião ou evento.
        </p>
      </header>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Buscar por nome</label>
            <div className="relative">
              <Input id="search" placeholder="Ex: Sala de Reuniões A" className="pr-10" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-foreground mb-1">Capacidade Mínima</label>
            <Input id="capacity" type="number" placeholder="Ex: 10" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1">Tipo de Sala</label>
            <Select>
              <SelectTrigger id="type">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="laboratorio">Laboratório</SelectItem>
                <SelectItem value="auditorio">Auditório</SelectItem>
                <SelectItem value="aula">Sala de Aula</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full lg:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </Button>
        </div>
      </div>

      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">
          Nenhuma sala encontrada com os filtros aplicados.
        </p>
      )}
    </div>
  );
}
