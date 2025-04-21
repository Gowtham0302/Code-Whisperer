// Explain Code Flow
'use server';

/**
 * @fileOverview Explains a given code snippet.
 *
 * - explainCode - A function that handles the code explanation process.
 * - ExplainCodeInput - The input type for the explainCode function.
 * - ExplainCodeOutput - The return type for the explainCode function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The code to be explained.'),
  explanationLevel: z.string().optional().describe('The desired level of detail in the explanation (e.g., concise, detailed).'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the code.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {
    schema: z.object({
      code: z.string().describe('The code to be explained.'),
      explanationLevel: z.string().optional().describe('The desired level of detail in the explanation (e.g., concise, detailed).'),
    }),
  },
  output: {
    schema: z.object({
      explanation: z.string().describe('The explanation of the code.'),
    }),
  },
  prompt: 'You are a coding tutor. Explain the following code in a conversational manner.\\n\\nCode:\\n\\n\'\'\'\\n{{{code}}}\n\'\'\'\\n\\nExplanation Level: {{{explanationLevel}}}\\n\\nExplanation:', 
});

const explainCodeFlow = ai.defineFlow<
  typeof ExplainCodeInputSchema,
  typeof ExplainCodeOutputSchema
>({
  name: 'explainCodeFlow',
  inputSchema: ExplainCodeInputSchema,
  outputSchema: ExplainCodeOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
