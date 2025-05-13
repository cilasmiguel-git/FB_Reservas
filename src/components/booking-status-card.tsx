import type { BookingRequest } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Building, AlertTriangle, CheckCircle2, XCircle, Hourglass, Edit, Trash2, ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingStatusCardProps {
  booking: BookingRequest;
  onCancel?: (bookingId: string) => void;
  onEdit?: (bookingId: string) => void;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onDeletePermanently?: (bookingId: string) => void; // New prop for permanent deletion
}

export default function BookingStatusCard({ booking, onCancel, onEdit, onApprove, onReject, onDeletePermanently }: BookingStatusCardProps) {
  const getStatusProps = (status: BookingRequest['status']) => {
    switch (status) {
      case 'Aprovada':
        return {
          icon: CheckCircle2,
          colorClass: 'bg-accent text-accent-foreground',
          text: 'Aprovada',
        };
      case 'Rejeitada':
        return {
          icon: XCircle,
          colorClass: 'bg-destructive text-destructive-foreground',
          text: 'Rejeitada',
        };
      case 'Pendente':
      default:
        return {
          icon: Hourglass,
          colorClass: 'bg-yellow-500 text-yellow-foreground', // Custom yellow
          text: 'Pendente',
        };
    }
  };

  const statusProps = getStatusProps(booking.status);
  const isAdminView = onApprove && onReject; // This implies it's being used in a context where approval/rejection is possible

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg mb-1">{booking.purpose}</CardTitle>
          <Badge className={cn("text-xs", statusProps.colorClass)}>
            <statusProps.icon className="mr-1 h-3.5 w-3.5" />
            {statusProps.text}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
            <Building className="h-4 w-4" /> {booking.roomName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{booking.time}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
        {booking.status === 'Pendente' && (
          <>
            {isAdminView ? ( // User can approve/reject
              <>
                <Button variant="outline" size="sm" onClick={() => onReject?.(booking.id)} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <X className="mr-1 h-4 w-4" /> Rejeitar
                </Button>
                <Button variant="default" size="sm" onClick={() => onApprove?.(booking.id)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Check className="mr-1 h-4 w-4" /> Aprovar
                </Button>
              </>
            ) : ( // User is likely the owner of the booking
              <>
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(booking.id)}>
                    <Edit className="mr-1 h-4 w-4" /> Editar
                  </Button>
                )}
                {onCancel && (
                  <Button variant="destructive" size="sm" onClick={() => onCancel(booking.id)}>
                    <Trash2 className="mr-1 h-4 w-4" /> Cancelar Solicitação
                  </Button>
                )}
              </>
            )}
          </>
        )}
        {(booking.status === 'Aprovada' || booking.status === 'Rejeitada') && onDeletePermanently && (
           <Button variant="destructive" size="sm" onClick={() => onDeletePermanently(booking.id)}>
            <Trash2 className="mr-1 h-4 w-4" /> Excluir Registro
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
