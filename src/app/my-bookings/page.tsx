'use client'; // For potential client-side interactions like cancel/edit

import React, { useState } from 'react';
import BookingStatusCard from '@/components/booking-status-card';
import { placeholderBookings } from '@/lib/placeholder-data';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button'; // Ensure Button is imported for AlertDialogTrigger

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>(placeholderBookings);
  const { toast } = useToast();
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  // In a real app, these would be API calls
  const handleCancelBooking = (bookingId: string) => {
    // Simulate API call and update state
    setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingId));
    toast({
      title: "Reserva Cancelada",
      description: "Sua solicitação de reserva foi cancelada.",
      variant: "default"
    });
    setBookingToCancel(null); // Close dialog
  };

  const handleEditBooking = (bookingId: string) => {
    // Navigate to edit page or open modal
    toast({
      title: "Função Indisponível",
      description: "A edição de reservas ainda não foi implementada.",
      variant: "default" // Or "destructive" if it's an error
    });
  };


  const filterBookingsByStatus = (status: BookingRequest['status'] | 'Todas') => {
    if (status === 'Todas') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  const bookingStatuses: (BookingRequest['status'] | 'Todas')[] = ['Todas', 'Pendente', 'Aprovada', 'Rejeitada'];

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
                    onCancel={() => setBookingToCancel(booking.id)} // Open dialog
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
        <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar esta solicitação de reserva? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBookingToCancel(null)}>Manter Reserva</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleCancelBooking(bookingToCancel)}>Confirmar Cancelamento</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
