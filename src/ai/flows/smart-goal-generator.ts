
'use server';

/**
 * @fileOverview AI-powered SMART goal example generator.
 *
 * - generateSmartGoalExamples - A function that generates SMART goal examples based on a user's goal.
 * - SmartGoalGeneratorInput - The input type for the generateSmartGoalExamples function.
 * - SmartGoalGeneratorOutput - The return type for the generateSmartGoalExamples function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartGoalGeneratorInputSchema = z.object({
  goal: z.string().describe('The user\'s initial, high-level goal.'),
});
export type SmartGoalGeneratorInput = z.infer<typeof SmartGoalGeneratorInputSchema>;

const SmartGoalGeneratorOutputSchema = z.object({
  specific: z.string().describe('An example of how to make the user\'s goal more specific.'),
  measurable: z.string().describe('An example of how to make the user\'s goal measurable.'),
  achievable: z.string().describe('A question or example to help the user determine if their goal is achievable.'),
  relevant: z.string().describe('An example of why the goal might be relevant to the user.'),
  timeBound: z.string().describe('An example of how to set a time-bound for the user\'s goal.'),
});
export type SmartGoalGeneratorOutput = z.infer<typeof SmartGoalGeneratorOutputSchema>;

export async function generateSmartGoalExamples(input: SmartGoalGeneratorInput): Promise<SmartGoalGeneratorOutput> {
  return smartGoalGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartGoalGeneratorPrompt',
  input: {schema: SmartGoalGeneratorInputSchema},
  output: {schema: SmartGoalGeneratorOutputSchema},
  prompt: `You are an AI assistant helping a young student turn a goal into a SMART goal.
The user's goal is: "{{{goal}}}"

Based on this goal, generate simple, kid-friendly examples for each of the SMART categories.
- For "specific", rewrite the goal to be much more detailed.
- For "measurable", describe how they could track progress.
- For "achievable", ask a simple question about whether it's possible.
- For "relevant", suggest a reason why this goal might be important to them.
- For "timeBound", suggest a clear deadline or timeframe.

Keep the language simple, encouraging, and easy for a 10-year-old to understand. Each example should be a single sentence.`,
});

const smartGoalGeneratorFlow = ai.defineFlow(
  {
    name: 'smartGoalGeneratorFlow',
    inputSchema: SmartGoalGeneratorInputSchema,
    outputSchema: SmartGoalGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
