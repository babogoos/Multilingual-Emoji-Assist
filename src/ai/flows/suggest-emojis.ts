// This is an AI-powered function that takes text as input and returns a list of relevant emoji suggestions.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmojisInputSchema = z.object({
  text: z.string().describe('The text to find emojis for.'),
});

export type SuggestEmojisInput = z.infer<typeof SuggestEmojisInputSchema>;

const SuggestEmojisOutputSchema = z.object({
  emojis: z
    .array(z.string())
    .describe(
      'A list of Unicode emoji characters. Each string in the array must be a single, valid Unicode emoji. For example: ["😀", "🎉", "👍"]. Do NOT return CLDR short names like ":grinning_face:" or any other text.'
    ),
});

export type SuggestEmojisOutput = z.infer<typeof SuggestEmojisOutputSchema>;

export async function suggestEmojis(input: SuggestEmojisInput): Promise<SuggestEmojisOutput> {
  return suggestEmojisFlow(input);
}

const suggestEmojisPrompt = ai.definePrompt({
  name: 'suggestEmojisPrompt',
  input: {schema: SuggestEmojisInputSchema},
  output: {schema: SuggestEmojisOutputSchema},
  prompt: `You are an expert emoji assistant. Your task is to suggest relevant Unicode emoji characters based on the user's input text.

Analyze the user's text carefully, considering its meaning, sentiment, and overall context.
The suggested emojis MUST be compatible with Emoji version 15.4 as defined by the Unicode Consortium.
For instance, Emoji 15.4 includes characters like:
- 🙂‍↔️ (Head Shaking Horizontally)
- 🙂‍↕️ (Head Shaking Vertically)
- 🐦‍🔥 (Phoenix)
- 🍋‍🟩 (Lime)
- 🍄‍🟫 (Brown Mushroom)
- ⛓️‍💥 (Broken Chain)
(Remember, your output should only be the Unicode characters, not the names or descriptions.)

The output MUST be a list of strings, where each string is a single, valid Unicode emoji character.

Examples of valid output:
- For "Happy birthday!", you might suggest: ["🎂", "🎉", "🥳", "🎁"]
- For "Feeling sad", you might suggest: ["😢", "😭", "😔"]
- For "Let's celebrate the new project launch!", you might suggest: ["🚀", "🎉", "🎊", "🍾"]

Examples of INVALID output (do NOT do this):
- ["grinning_face", "party_popper"]
- [":smile:", ":tada:"]
- ["smile emoji", "celebration emoji"]
- "🎂🎉🥳🎁" (single string with multiple emojis)

User's text:
{{{text}}}

Suggested Unicode Emoji Characters (compatible with Emoji version 15.4 as defined by the Unicode Consortium):`,
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
