import Image from 'next/image';
import type { Room } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, MapPin, Tag, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const StatusIcon = room.availableNow ? CheckCircle2 : XCircle;
  
  return (
    <Card className="flex flex-col overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={room.imageUrl}
          alt={room.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
          data-ai-hint={room.imageHint}
        />
        <Badge 
          variant={room.availableNow ? "default" : "destructive"} 
          className={cn(
            "absolute top-2 right-2",
            room.availableNow ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
          )}
        >
          <StatusIcon className="mr-1 h-3 w-3" />
          {room.statusText}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-1">{room.name}</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Capacidade: {room.capacity} pessoas</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{room.floor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Tipo: {room.type}</span>
          </div>
          {room.amenities.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mt-2 mb-1">Comodidades:</h4>
              <div className="flex flex-wrap gap-1">
                {room.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">{amenity}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full">
          <Link href={`/book?roomId=${room.id}`}>Reservar Sala</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
