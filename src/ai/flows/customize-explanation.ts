// src/ai/flows/customize-explanation.ts
'use server';
/**
 * @fileOverview Code explanation customization flow.
 *
 * - customizeExplanation - A function that explains the code, with a level of detail.
 * - CustomizeExplanationInput - The input type for the customizeExplanation function.
 * - CustomizeExplanationOutput - The return type for the customizeExplanation function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CustomizeExplanationInputSchema = z.object({
  code: z.string().describe('The code to be explained.'),
  detailLevel: z.string().describe('The desired level of detail in the explanation (e.g., beginner, intermediate, expert).'),
});
export type CustomizeExplanationInput = z.infer<typeof CustomizeExplanationInputSchema>;

const CustomizeExplanationOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the code, tailored to the specified detail level.'),
});
export type CustomizeExplanationOutput = z.infer<typeof CustomizeExplanationOutputSchema>;

export async function customizeExplanation(input: CustomizeExplanationInput): Promise<CustomizeExplanationOutput> {
  return customizeExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeExplanationPrompt',
  input: {
    schema: z.object({
      code: z.string().describe('The code to be explained.'),
      detailLevel: z.string().describe('The desired level of detail in the explanation (e.g., beginner, intermediate, expert).'),
    }),
  },
  output: {
    schema: z.object({
      explanation: z.string().describe('The explanation of the code, tailored to the specified detail level.'),
    }),
  },
  prompt: `You are an expert code tutor, skilled at explaining code concepts in a way that is easy to understand.

You will be given a piece of code and a desired level of detail. You will then generate an explanation of the code that is tailored to the specified detail level.

Code: {{{code}}}
Detail Level: {{{detailLevel}}}

Explanation:`,
});

const customizeExplanationFlow = ai.defineFlow<
  typeof CustomizeExplanationInputSchema,
  typeof CustomizeExplanationOutputSchema
>({
  name: 'customizeExplanationFlow',
  inputSchema: CustomizeExplanationInputSchema,
  outputSchema: CustomizeExplanationOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
