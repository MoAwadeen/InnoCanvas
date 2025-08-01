// AI flow for improving Business Model Canvas with Gemini AI integration.

'use server';

/**
 * @fileOverview A flow for providing AI-driven suggestions to improve a Business Model Canvas (BMC).
 *
 * - getAIImprovementSuggestions - A function that takes a BMC as input and returns improvement suggestions.
 * - GetAIImprovementSuggestionsInput - The input type for the getAIImprovementSuggestions function.
 * - GetAIImprovementSuggestionsOutput - The return type for the getAIImprovementSuggestions function.
 */

import {ai, handleAIError} from '@/ai/genkit';
import {z} from 'genkit';

const GetAIImprovementSuggestionsInputSchema = z.object({
  bmcData: z.record(z.string(), z.string())
    .min(1, 'BMC data cannot be empty')
    .describe('The data representing the Business Model Canvas, where keys are BMC sections and values are their content.'),
  businessDescription: z.string()
    .min(1, 'Business description is required')
    .max(500, 'Business description must be less than 500 characters')
    .describe('A brief description of the business for context.'),
});
export type GetAIImprovementSuggestionsInput = z.infer<typeof GetAIImprovementSuggestionsInputSchema>;

const GetAIImprovementSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string())
    .min(1, 'At least one suggestion is required')
    .max(10, 'Maximum 10 suggestions allowed')
    .describe('An array of AI-generated suggestions for improving the BMC.'),
});
export type GetAIImprovementSuggestionsOutput = z.infer<typeof GetAIImprovementSuggestionsOutputSchema>;

export async function getAIImprovementSuggestions(input: GetAIImprovementSuggestionsInput): Promise<GetAIImprovementSuggestionsOutput> {
  try {
    // Validate input
    const validatedInput = GetAIImprovementSuggestionsInputSchema.parse(input);
    return await getAIImprovementSuggestionsFlow(validatedInput);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error(handleAIError(error, 'Failed to generate improvement suggestions'));
  }
}

const prompt = ai.definePrompt({
  name: 'getAIImprovementSuggestionsPrompt',
  input: {schema: GetAIImprovementSuggestionsInputSchema},
  output: {schema: GetAIImprovementSuggestionsOutputSchema},
  prompt: `You are an expert business consultant reviewing a Business Model Canvas (BMC). Provide specific, actionable suggestions for improving the BMC, referencing business best practices.

Business Description: {{{businessDescription}}}

BMC Data:
{{#each bmcData}}
  {{@key}}: {{{this}}}
{{/each}}

Please provide 3-5 specific, actionable suggestions for improving this Business Model Canvas. Focus on:
1. Gaps or missing elements
2. Opportunities for better alignment between sections
3. Potential risks or challenges
4. Ways to strengthen value propositions
5. Revenue model optimization

Format each suggestion as a clear, actionable statement.`,
});

const getAIImprovementSuggestionsFlow = ai.defineFlow(
  {
    name: 'getAIImprovementSuggestionsFlow',
    inputSchema: GetAIImprovementSuggestionsInputSchema,
    outputSchema: GetAIImprovementSuggestionsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate suggestions');
      }
      return output;
    } catch (error) {
      throw new Error(handleAIError(error, 'Failed to generate improvement suggestions'));
    }
  }
);
