'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { placeholderRooms } from '@/lib/placeholder-data';
import type { Room, BookingRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { addBooking as addBookingToStorage } from '@/lib/booking-storage';

const bookingFormSchema = z.object({
  roomId: z.string().min(1, { message: 'Selecione uma sala.' }),
  date: z.date({ required_error: 'Selecione uma data.' }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Formato de hora inválido (HH:MM).' }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Formato de hora inválido (HH:MM).' }),
  purpose: z.string().min(5, { message: 'Descreva o propósito da reserva (mín. 5 caracteres).' }).max(200),
}).refine(data => {
  if (data.startTime && data.endTime) {
    return data.endTime > data.startTime;
  }
  return true;
}, {
  message: "O horário de término deve ser após o horário de início.",
  path: ["endTime"],
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedRoomId = searchParams.get('roomId');
  const preselectedRoomName = searchParams.get('roomName');

  const [isLoading, setIsLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  useEffect(() => {
    setAvailableRooms(placeholderRooms);
  }, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      roomId: preselectedRoomId || '',
      startTime: '09:00',
      endTime: '10:00',
      purpose: '',
      date: new Date(),
    },
  });

  useEffect(() => {
    if (preselectedRoomName && !form.getValues('roomId') && availableRooms.length > 0) {
      try {
        const decodedRoomName = decodeURIComponent(preselectedRoomName);
        const room = availableRooms.find(r => r.name === decodedRoomName);
        if (room) {
          form.setValue('roomId', room.id);
        }
      } catch (e) {
        console.error("Error decoding room name from URL:", e);
      }
    }
  }, [preselectedRoomName, availableRooms, form]);


  async function onSubmit(data: BookingFormValues) {
    setIsLoading(true);

    const selectedRoom = availableRooms.find(r => r.id === data.roomId);
    if (!selectedRoom) {
      toast({ title: 'Erro', description: 'Sala selecionada não encontrada.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const newBooking: BookingRequest = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      roomId: data.roomId,
      roomName: selectedRoom.name,
      date: format(data.date, 'yyyy-MM-dd'),
      time: `${data.startTime} - ${data.endTime}`,
      purpose: data.purpose,
      status: 'Pendente',
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addBookingToStorage(newBooking);

    toast({
      title: 'Solicitação Enviada!',
      description: `Sua reserva para ${newBooking.roomName} foi enviada para aprovação.`,
      variant: 'default'
    });
    form.reset({
      roomId: '',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      purpose: '',
    });
    setIsLoading(false);
    router.push('/my-bookings');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala Desejada</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''} defaultValue={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableRooms.length === 0 && <SelectItem value="loading" disabled>Carregando salas...</SelectItem>}
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} (Capacidade: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Reserva</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Início</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Término</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Propósito da Reserva</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Aula de Cálculo I, Reunião de Planejamento, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Descreva brevemente o motivo da reserva.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Enviando...' : 'Solicitar Reserva'}
        </Button>
      </form>
    </Form>
  );
}