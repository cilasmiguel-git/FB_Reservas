'use client';

import React, { useState, useEffect } from 'react';
import BookingStatusCard from '@/components/booking-status-card';
import { getBookings, updateBooking as updateBookingInStorage } from '@/lib/booking-storage';
import type { BookingRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';


export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [actionToConfirm, setActionToConfirm] = useState<{
    type: 'approve' | 'reject';
    bookingId: string;
    roomName: string;
    purpose: string;
  } | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Fetch initial bookings. Subsequent updates will modify this state.
    if (typeof window !== "undefined") { // Ensure localStorage access is safe
        setBookings(getBookings());
    }
  }, []);
  
  // Refetch bookings if localStorage might have been updated by another tab/window
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


  const handleConfirmAction = () => {
    if (!actionToConfirm) return;

    const { type, bookingId, roomName } = actionToConfirm;
    const bookingToUpdate = bookings.find(b => b.id === bookingId);

    if (!bookingToUpdate) {
      toast({ title: 'Erro', description: 'Reserva não encontrada.', variant: 'destructive' });
      setActionToConfirm(null);
      return;
    }

    const newStatus = type === 'approve' ? 'Aprovada' : 'Rejeitada';
    const updatedBooking: BookingRequest = { ...bookingToUpdate, status: newStatus };

    updateBookingInStorage(updatedBooking);
    // Optimistically update UI
    setBookings(prevBookings => prevBookings.map(b => b.id === bookingId ? updatedBooking : b));
    
    toast({
      title: `Reserva ${newStatus === 'Aprovada' ? 'Aprovada' : 'Rejeitada'}`,
      description: `A solicitação para "${bookingToUpdate.purpose}" na sala "${roomName}" foi ${newStatus.toLowerCase()}.`,
      variant: type === 'approve' ? 'default' : 'default', // 'default' for both, or 'destructive' for reject if preferred visually
    });
    setActionToConfirm(null);
  };

  const openConfirmationDialog = (type: 'approve' | 'reject', booking: BookingRequest) => {
    setActionToConfirm({ type, bookingId: booking.id, roomName: booking.roomName, purpose: booking.purpose });
  };
  
  const filterBookingsByStatus = (status: BookingRequest['status'] | 'Todas') => {
    if (status === 'Todas') return bookings;
    return bookings.filter(booking => booking.status === status);
  };
  
  const bookingStatuses: (BookingRequest['status'] | 'Todas')[] = ['Todas', 'Pendente', 'Aprovada', 'Rejeitada'];

  if (!isClient) {
    return <p className="text-center text-muted-foreground py-10">Carregando solicitações de reserva...</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3 border-b pb-4">
         <ShieldCheck className="h-10 w-10 text-primary" />
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Solicitações</h1>
            <p className="text-muted-foreground">
            Aprove ou rejeite as solicitações de reserva de salas.
            </p>
        </div>
      </header>

      <Tabs defaultValue="Pendente" className="w-full">
         <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
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
                    onApprove={booking.status === 'Pendente' ? () => openConfirmationDialog('approve', booking) : undefined}
                    onReject={booking.status === 'Pendente' ? () => openConfirmationDialog('reject', booking) : undefined}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">
                Nenhuma reserva com o status "{status}" para gerenciar.
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {actionToConfirm && (
        <AlertDialog open={!!actionToConfirm} onOpenChange={(open) => { if(!open) setActionToConfirm(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja {actionToConfirm.type === 'approve' ? 'APROVAR' : 'REJEITAR'} a solicitação de reserva para "{actionToConfirm.purpose}" na sala "{actionToConfirm.roomName}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmAction}
                className={cn(actionToConfirm.type === 'reject' && buttonVariants({ variant: "destructive" }))}
              >
                Confirmar {actionToConfirm.type === 'approve' ? 'Aprovação' : 'Rejeição'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
