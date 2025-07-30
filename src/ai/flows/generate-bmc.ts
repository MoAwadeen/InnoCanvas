// A Genkit Flow for generating a Business Model Canvas (BMC) from a business description and clarifying questions.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @fileOverview An AI agent that generates a Business Model Canvas (BMC) from a business description and clarifying questions.
 *
 * - generateBMC - A function that handles the BMC generation process.
 * - GenerateBMCInput - The input type for the generateBMC function.
 * - GenerateBMCOutput - The return type for the generateBMC function.
 */

const GenerateBMCInputSchema = z.object({
  businessDescription: z
    .string()
    .describe('A short description of the business.'),
  valuePropositions: z
    .string()
    .describe('Clarifying question: What core problem does your business solve?'),
  customerSegments: z
    .string()
    .describe('Clarifying question: Who benefits most from your solution?'),
  channels: z
    .string()
    .describe('Clarifying question: How do you reach and interact with your customers?'),
  revenueStreams: z
    .string()
    .describe('Clarifying question: What is your main revenue model?'),
  keyResources: z
    .string()
    .describe('Clarifying question: What is your most critical resource or asset?'),
  customerRelationships: z
    .string()
    .describe('Clarifying question: What type of relationship do you establish with your customers? (Defaulted)'),
  keyActivities: z
    .string()
    .describe('Clarifying question: What key activities do you perform? (Defaulted)'),
  keyPartnerships: z
    .string()
    .describe('Clarifying question: Who are your key partners? (Defaulted)'),
  costStructure: z
    .string()
    .describe('Clarifying question: What are the most important costs in your business? (Defaulted)'),
});

export type GenerateBMCInput = z.infer<typeof GenerateBMCInputSchema>;

const GenerateBMCOutputSchema = z.object({
  customerSegments: z.string().describe('The customer segments of the business.'),
  valuePropositions: z.string().describe('The value propositions of the business.'),
  channels: z.string().describe('The channels of the business.'),
  customerRelationships: z
    .string()
    .describe('The customer relationships of the business.'),
  revenueStreams: z.string().describe('The revenue streams of the business.'),
  keyActivities: z.string().describe('The key activities of the business.'),
  keyResources: z.string().describe('The key resources of the business.'),
  keyPartnerships: z.string().describe('The key partnerships of the business.'),
  costStructure: z.string().describe('The cost structure of the business.'),
});

export type GenerateBMCOutput = z.infer<typeof GenerateBMCOutputSchema>;

export async function generateBMC(input: GenerateBMCInput): Promise<GenerateBMCOutput> {
  return generateBmcFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBmcPrompt',
  input: {schema: GenerateBMCInputSchema},
  output: {schema: GenerateBMCOutputSchema},
  prompt: `You are a business expert and strategist. Based on the following input, generate a complete Business Model Canvas (BMC) with clear, insightful, and non-generic content for each of the 9 blocks. Use relevant startup and industry knowledge.

1. Use the business description and answers to multiple-choice questions to infer logical business decisions.
2. For all sections except for 'valuePropositions', provide a short list of 2-3 bullet points (using '- ' as the prefix). The bullet points should be concise. For the 'valuePropositions' section, provide a descriptive sentence.
3. Ensure all blocks are filled with unique, startup-relevant data.
4. The output should be a JSON object with 9 labeled fields: keyPartnerships, keyActivities, valuePropositions, customerRelationships, customerSegments, keyResources, channels, costStructure, revenueStreams.

---

Business Idea:
{{{businessDescription}}}

Core Problem Solved: {{{valuePropositions}}}
Primary Beneficiary: {{{customerSegments}}}
Customer Channels: {{{channels}}}
Revenue Model: {{{revenueStreams}}}
Critical Resource: {{{keyResources}}}

Defaulted Values (use for context):
Key Activities: {{{keyActivities}}}
Key Partnerships: {{{keyPartnerships}}}
Cost Structure: {{{costStructure}}}
Customer Relationships: {{{customerRelationships}}}
---
`,
});

const generateBmcFlow = ai.defineFlow(
  {
    name: 'generateBmcFlow',
    inputSchema: GenerateBMCInputSchema,
    outputSchema: GenerateBMCOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
