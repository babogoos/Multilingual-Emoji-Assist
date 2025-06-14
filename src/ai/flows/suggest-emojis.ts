// This is an AI-powered function that takes text as input and returns a list of relevant emoji suggestions.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmojisInputSchema = z.object({
  text: z.string().describe('The text to find emojis for.'),
});

export type SuggestEmojisInput = z.infer<typeof SuggestEmojisInputSchema>;

const SuggestEmojisOutputSchema = z.object({
  emojis: z.array(z.string()).describe('The list of emojis suggested for the text.'),
});

export type SuggestEmojisOutput = z.infer<typeof SuggestEmojisOutputSchema>;

export async function suggestEmojis(input: SuggestEmojisInput): Promise<SuggestEmojisOutput> {
  return suggestEmojisFlow(input);
}

const suggestEmojisPrompt = ai.definePrompt({
  name: 'suggestEmojisPrompt',
  input: {schema: SuggestEmojisInputSchema},
  output: {schema: SuggestEmojisOutputSchema},
  prompt: `You are an emoji expert. Given the following text, suggest a list of relevant emojis.
Text: {{{text}}}
Emojis:`, // Keep newlines.
});

const suggestEmojisFlow = ai.defineFlow(
  {
    name: 'suggestEmojisFlow',
    inputSchema: SuggestEmojisInputSchema,
    outputSchema: SuggestEmojisOutputSchema,
  },
  async input => {
    const {output} = await suggestEmojisPrompt(input);
    return output!;
  }
);
