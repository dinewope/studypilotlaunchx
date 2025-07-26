
// src/ai/flows/ai-study-optimizer.ts
'use server';

/**
 * @fileOverview AI-powered study schedule generator.
 *
 * - generateStudySchedule - A function that generates a study schedule based on test date and topics.
 * - AiStudyOptimizerInput - The input type for the generateStudySchedule function.
 * - AiStudyOptimizerOutput - The return type for the generateStudySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiStudyOptimizerInputSchema = z.object({
  testDate: z.string().describe('The date of the test (e.g., YYYY-MM-DD).'),
  topics: z.string().describe('The topics to be covered in the study schedule.'),
  daysUntilTest: z.number().describe('The number of days from today until the test.'),
});
export type AiStudyOptimizerInput = z.infer<typeof AiStudyOptimizerInputSchema>;

const AiStudyOptimizerOutputSchema = z.object({
  studySchedule: z.string().describe('The generated study schedule.'),
});
export type AiStudyOptimizerOutput = z.infer<typeof AiStudyOptimizerOutputSchema>;

export async function generateStudySchedule(input: AiStudyOptimizerInput): Promise<AiStudyOptimizerOutput> {
  return aiStudyOptimizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStudyOptimizerPrompt',
  input: {schema: AiStudyOptimizerInputSchema},
  output: {schema: AiStudyOptimizerOutputSchema},
  prompt: `You are an AI study planner that helps young students. You will generate a study schedule based on the number of days until the test and the topics provided.

There are {{{daysUntilTest}}} days until the test.
Topics: {{{topics}}}

Generate a study plan for each of the {{{daysUntilTest}}} days. Use a "Day 1", "Day 2", etc. format. Each day should be on a new line. Break down the topics into small, easy-to-manage tasks for each day. If there are many days, you can include rest days. Keep the language simple and encouraging. Do not include external resources, just focus on the tasks.`,
});

const aiStudyOptimizerFlow = ai.defineFlow(
  {
    name: 'aiStudyOptimizerFlow',
    inputSchema: AiStudyOptimizerInputSchema,
    outputSchema: AiStudyOptimizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
