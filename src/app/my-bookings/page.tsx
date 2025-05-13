'use client'; 

import React, { useState, useEffect } from 'react';
import BookingStatusCard from '@/components/booking-status-card';
import { getBookings, deleteBooking as deleteBookingFromStorage } from '@/lib/booking-storage';
import type { BookingRequest } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const { toast } = useToast();
  const [bookingToCancel, setBookingToCancel] = useState<{ id: string, purpose: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    if (typeof window !== "undefined") {
      setBookings(getBookings());
    }
  }, []);

  // Listen for storage changes to update bookings if modified in another tab (e.g., admin actions)
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fbsalas_bookings') {
        setBookings(getBookings());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isClient]);


  const handleTriggerCancel = (booking: BookingRequest) => {
    setBookingToCancel({ id: booking.id, purpose: booking.purpose });
  };

  const handleConfirmCancelBooking = () => {
    if (!bookingToCancel) return;
    
    deleteBookingFromStorage(bookingToCancel.id); 
    setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingToCancel.id)); 
    toast({
      title: "Reserva Cancelada",
      description: `Sua solicitação de reserva para "${bookingToCancel.purpose}" foi cancelada.`,
      variant: "default"
    });
    setBookingToCancel(null); 
  };

  const handleEditBooking = (bookingId: string) => {
    // For now, this redirects to the booking form, pre-filling some data would be ideal
    // but the current form doesn't support editing existing bookings easily.
    // router.push(`/book?bookingId=${bookingId}`); // Example for future enhancement
    toast({
      title: "Função Indisponível",
      description: "A edição de reservas ainda não foi implementada. Cancele e crie uma nova se necessário.",
      variant: "default"
    });
  };


  const filterBookingsByStatus = (status: BookingRequest['status'] | 'Todas') => {
    if (status === 'Todas') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const bookingStatuses: (BookingRequest['status'] | 'Todas')[] = ['Todas', 'Pendente', 'Aprovada', 'Rejeitada'];
  
  if (!isClient) {
    return <p className="text-center text-muted-foreground py-10">Carregando suas reservas...</p>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Reservas</h1>
        <p className="text-muted-foreground">
          Acompanhe o status de suas solicitações de reserva.
        </p>
      </header>

      <Tabs defaultValue="Todas" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          {bookingStatuses.map(status => (
            <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
          ))}
        </TabsList>

        {bookingStatuses.map(status => (
          <TabsContent key={status} value={status}>
            {filterBookingsByStatus(status).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterBookingsByStatus(status).map((booking) => (
                  <BookingStatusCard 
                    key={booking.id} 
                    booking={booking} 
                    onCancel={() => handleTriggerCancel(booking)} 
                    onEdit={() => handleEditBooking(booking.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">
                Nenhuma reserva encontrada com o status "{status}".
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {bookingToCancel && (
        <AlertDialog open={!!bookingToCancel} onOpenChange={(open) => { if(!open) setBookingToCancel(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar a solicitação de reserva para "{bookingToCancel.purpose}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBookingToCancel(null)}>Manter Reserva</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmCancelBooking}
                className={cn(buttonVariants({ variant: "destructive" }))}
              >
                Confirmar Cancelamento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
