'use server';

import { suggestRooms as suggestRoomsFlow, type SuggestRoomsInput, type SuggestRoomsOutput } from '@/ai/flows/suggest-rooms';

export async function getAiRoomSuggestions(input: SuggestRoomsInput): Promise<SuggestRoomsOutput | { error: string }> {
  try {
    // Basic input validation (can be more sophisticated with Zod on the server if needed)
    if (!input.description || input.description.trim().length < 10) {
      return { error: 'A descrição deve ter pelo menos 10 caracteres.' };
    }
    
    const suggestions = await suggestRoomsFlow(input);
    return suggestions;
  } catch (error) {
    console.error('Error fetching AI room suggestions:', error);
    return { error: 'Ocorreu um erro ao buscar sugestões. Tente novamente mais tarde.' };
  }
}
