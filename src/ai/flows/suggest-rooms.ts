// src/ai/flows/suggest-rooms.ts
'use server';
/**
 * @fileOverview Provides room suggestions based on a description of the class.
 *
 * - suggestRooms - A function that suggests the top 3 available rooms.
 * - SuggestRoomsInput - The input type for the suggestRooms function.
 * - SuggestRoomsOutput - The return type for the suggestRooms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRoomsInputSchema = z.object({
  description: z.string().describe('A description of the class or event.'),
});
export type SuggestRoomsInput = z.infer<typeof SuggestRoomsInputSchema>;

const SuggestRoomsOutputSchema = z.object({
  rooms: z
    .array(
      z.object({
        name: z.string().describe('The name of the room.'),
        capacity: z.number().describe('The capacity of the room.'),
        availability: z.string().describe('A description of the room\'s availability.'),
      })
    )
    .describe('The top 3 suggested rooms.'),
});
export type SuggestRoomsOutput = z.infer<typeof SuggestRoomsOutputSchema>;

export async function suggestRooms(input: SuggestRoomsInput): Promise<SuggestRoomsOutput> {
  return suggestRoomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRoomsPrompt',
  input: {schema: SuggestRoomsInputSchema},
  output: {schema: SuggestRoomsOutputSchema},
  prompt: `You are a helpful assistant that suggests rooms based on the description of a class or event.

  Suggest the top 3 rooms that would be suitable for the following description:
  {{description}}

  Consider the capacity and availability of the rooms.
  Return the rooms in a JSON format.
  `,
});

const suggestRoomsFlow = ai.defineFlow(
  {
    name: 'suggestRoomsFlow',
    inputSchema: SuggestRoomsInputSchema,
    outputSchema: SuggestRoomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
