
'use server';
/**
 * @fileOverview An AI agent that analyzes a student's weekly schedule.
 *
 * - analyzeSchedule - A function that handles the schedule analysis.
 * - ScheduleAnalyzerInput - The input type for the analyzeSchedule function.
 * - ScheduleAnalysisOutput - The return type for the analyzeSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScheduleAnalyzerInputSchema = z.object({
  schedule: z.string().describe("The student's proposed weekly schedule in JSON format."),
});
export type ScheduleAnalyzerInput = z.infer<typeof ScheduleAnalyzerInputSchema>;

const ScheduleAnalysisOutputSchema = z.object({
  isGood: z.boolean().describe('Whether the schedule is well-balanced and avoids procrastination.'),
  feedback: z.string().describe("Actionable and encouraging feedback for the student about their schedule."),
});
export type ScheduleAnalysisOutput = z.infer<typeof ScheduleAnalysisOutputSchema>;

export async function analyzeSchedule(input: ScheduleAnalyzerInput): Promise<ScheduleAnalysisOutput> {
  return scheduleAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scheduleAnalyzerPrompt',
  input: {schema: ScheduleAnalyzerInputSchema},
  output: {schema: ScheduleAnalysisOutputSchema},
  prompt: `You are an AI assistant that helps young students with time management. You will analyze the provided weekly schedule and give feedback.

The schedule includes deadlines for a Math Test (Wednesday), an English Essay (Friday), and a Science Project (Sunday).

Analyze the schedule for the following:
1.  **Procrastination:** Are all the study sessions crammed in right before the deadline?
2.  **Balance:** Is the work spread out across the week? Is there time for rest?
3.  **Efficiency:** Did the student schedule tasks logically?

Based on your analysis, provide one piece of actionable, encouraging, and simple feedback. If the schedule is good, praise the student and explain why it's a good plan (e.g., "Spreading out your science project work is a great idea!"). If it could be improved, gently suggest a change (e.g., "Your plan looks good! To make it even better, maybe try studying for your math test a little on Monday too?").

Set the 'isGood' flag to true if the schedule is reasonably well-planned, especially if it avoids last-minute cramming.

The user's schedule:
{{{schedule}}}`,
});

const scheduleAnalyzerFlow = ai.defineFlow(
  {
    name: 'scheduleAnalyzerFlow',
    inputSchema: ScheduleAnalyzerInputSchema,
    outputSchema: ScheduleAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
