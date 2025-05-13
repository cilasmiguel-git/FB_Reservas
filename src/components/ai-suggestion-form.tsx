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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { getAiRoomSuggestions } from '@/app/actions';
import type { SuggestedRoom } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, Users, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const aiSuggestionFormSchema = z.object({
  description: z.string().min(10, { message: 'Descreva seu evento com pelo menos 10 caracteres.' }).max(500, { message: 'Descrição muito longa (máx. 500 caracteres).' }),
});

type AiSuggestionFormValues = z.infer<typeof aiSuggestionFormSchema>;

export default function AiSuggestionForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedRooms, setSuggestedRooms] = useState<SuggestedRoom[]>([]);

  const form = useForm<AiSuggestionFormValues>({
    resolver: zodResolver(aiSuggestionFormSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(data: AiSuggestionFormValues) {
    setIsLoading(true);
    setSuggestedRooms([]); // Clear previous suggestions
    
    const result = await getAiRoomSuggestions({ description: data.description });

    if ('error' in result) {
      toast({
        title: 'Erro na Sugestão',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.rooms && result.rooms.length > 0) {
      setSuggestedRooms(result.rooms);
      toast({
        title: 'Sugestões Encontradas!',
        description: 'Veja abaixo as salas recomendadas pela IA.',
      });
    } else {
      toast({
        title: 'Nenhuma Sugestão',
        description: 'Não encontramos sugestões para a descrição fornecida. Tente ser mais específico.',
        variant: 'default',
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Descrição do Evento/Aula</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Aula de marketing digital para 30 alunos com necessidade de projetor e boa acústica."
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Forneça detalhes sobre o tipo de evento, número de participantes, equipamentos necessários, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando Sugestões...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Obter Sugestões IA
              </>
            )}
          </Button>
        </form>
      </Form>

      {suggestedRooms.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">Salas Sugeridas pela IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedRooms.map((room, index) => (
              <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-accent" />
                    {room.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm flex-grow">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacidade: {room.capacity} pessoas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Disponibilidade Histórica: {room.availability}</span>
                  </div>
                </CardContent>
                <div className="p-4 border-t mt-auto">
                   {/* In a real app, find the room ID from placeholderRooms or fetched data */}
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/book?roomName=${encodeURIComponent(room.name)}`}>Ver Detalhes e Reservar</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
