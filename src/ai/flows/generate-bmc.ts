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
  customerSegments: z
    .string()
    .describe('Clarifying question: Who are the target customers?'),
  valuePropositions: z
    .string()
    .describe('Clarifying question: What value do you deliver to the customer?'),
  channels: z
    .string()
    .describe('Clarifying question: Through which channels do you reach your customers?'),
  customerRelationships: z
    .string()
    .describe('Clarifying question: What type of relationship do you establish with your customers?'),
  revenueStreams: z
    .string()
    .describe('Clarifying question: What are the revenue streams?'),
  keyActivities: z
    .string()
    .describe('Clarifying question: What key activities do you perform?'),
  keyResources: z
    .string()
    .describe('Clarifying question: What key resources do you require?'),
  keyPartnerships: z
    .string()
    .describe('Clarifying question: Who are your key partners?'),
  costStructure: z
    .string()
    .describe('Clarifying question: What are the most important costs in your business?'),
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
  prompt: `You are an expert business consultant specializing in creating Business Model Canvases (BMCs).

You will use the provided business description and answers to clarifying questions to populate a BMC.

Business Description: {{{businessDescription}}}

Customer Segments: {{{customerSegments}}}
Value Propositions: {{{valuePropositions}}}
Channels: {{{channels}}}
Customer Relationships: {{{customerRelationships}}}
Revenue Streams: {{{revenueStreams}}}
Key Activities: {{{keyActivities}}}
Key Resources: {{{keyResources}}}
Key Partnerships: {{{keyPartnerships}}}
Cost Structure: {{{costStructure}}}

Populate the BMC sections with concise and informative content based on the above information.

Ensure each section is well-defined and relevant to the business.
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
