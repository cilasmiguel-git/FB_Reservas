
'use client'; 

import React, { useState, useEffect } from 'react';
import BookingStatusCard from '@/components/booking-status-card';
import { getBookings, deleteBooking as deleteBookingFromStorage, updateBooking as updateBookingInStorage } from '@/lib/booking-storage';
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
  const [actionToConfirm, setActionToConfirm] = useState<{
    type: 'cancel' | 'approve' | 'reject';
    booking: BookingRequest;
  } | null>(null);
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


  const openConfirmationDialog = (type: 'cancel' | 'approve' | 'reject', booking: BookingRequest) => {
    setActionToConfirm({ type, booking });
  };

  const handleConfirmAction = () => {
    if (!actionToConfirm) return;

    const { type, booking } = actionToConfirm;

    if (type === 'cancel') {
      deleteBookingFromStorage(booking.id); 
      setBookings(prevBookings => prevBookings.filter(b => b.id !== booking.id)); 
      toast({
        title: "Reserva Cancelada",
        description: `Sua solicitação de reserva para "${booking.purpose}" foi cancelada.`,
        variant: "default"
      });
    } else if (type === 'approve' || type === 'reject') {
      const bookingToUpdate = bookings.find(b => b.id === booking.id);
      if (!bookingToUpdate) {
        toast({ title: 'Erro', description: 'Reserva não encontrada.', variant: 'destructive' });
        setActionToConfirm(null);
        return;
      }
      const newStatus = type === 'approve' ? 'Aprovada' : 'Rejeitada';
      const updatedBooking: BookingRequest = { ...bookingToUpdate, status: newStatus };
      
      updateBookingInStorage(updatedBooking);
      setBookings(prevBookings => prevBookings.map(b => b.id === booking.id ? updatedBooking : b));
      
      toast({
        title: `Reserva ${newStatus === 'Aprovada' ? 'Aprovada' : 'Rejeitada'}`,
        description: `A solicitação para "${bookingToUpdate.purpose}" na sala "${bookingToUpdate.roomName}" foi ${newStatus.toLowerCase()}.`,
        variant: type === 'approve' ? 'default' : 'default',
      });
    }
    
    setActionToConfirm(null); 
  };

  const handleEditBooking = (bookingId: string) => {
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

  const getDialogTexts = () => {
    if (!actionToConfirm) return { title: '', description: '', confirmText: '' };
    const { type, booking } = actionToConfirm;
    switch (type) {
      case 'cancel':
        return {
          title: 'Confirmar Cancelamento',
          description: `Tem certeza que deseja cancelar a solicitação de reserva para "${booking.purpose}"? Esta ação não pode ser desfeita.`,
          confirmText: 'Confirmar Cancelamento',
        };
      case 'approve':
        return {
          title: 'Confirmar Aprovação',
          description: `Tem certeza que deseja APROVAR a solicitação de reserva para "${booking.purpose}" na sala "${booking.roomName}"?`,
          confirmText: 'Confirmar Aprovação',
        };
      case 'reject':
        return {
          title: 'Confirmar Rejeição',
          description: `Tem certeza que deseja REJEITAR a solicitação de reserva para "${booking.purpose}" na sala "${booking.roomName}"?`,
          confirmText: 'Confirmar Rejeição',
        };
      default:
        return { title: '', description: '', confirmText: '' };
    }
  };

  const dialogTexts = getDialogTexts();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Reservas</h1>
        <p className="text-muted-foreground">
          Acompanhe o status e gerencie suas solicitações de reserva.
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
                    onCancel={booking.status === 'Pendente' ? () => openConfirmationDialog('cancel', booking) : undefined} 
                    onEdit={() => handleEditBooking(booking.id)}
                    onApprove={booking.status === 'Pendente' ? () => openConfirmationDialog('approve', booking) : undefined}
                    onReject={booking.status === 'Pendente' ? () => openConfirmationDialog('reject', booking) : undefined}
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
      
      {actionToConfirm && (
        <AlertDialog open={!!actionToConfirm} onOpenChange={(open) => { if(!open) setActionToConfirm(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogTexts.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogTexts.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setActionToConfirm(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmAction}
                className={cn(actionToConfirm.type !== 'approve' && buttonVariants({ variant: "destructive" }))}
              >
                {dialogTexts.confirmText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

