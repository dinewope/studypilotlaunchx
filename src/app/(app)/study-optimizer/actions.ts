'use server';

import { generateStudySchedule } from '@/ai/flows/ai-study-optimizer';
import { z } from 'zod';
import {format, differenceInDays} from "date-fns";

export interface StudyOptimizerState {
  studySchedule?: string;
  error?: string;
}

const StudyOptimizerSchema = z.object({
  testDate: z.date({
    required_error: 'Please select the date of your test.',
  }),
  topics: z.string().min(10, 'Please list the topics you need to study.'),
});

export async function createStudyPlan(
  prevState: StudyOptimizerState,
  formData: FormData,
): Promise<StudyOptimizerState> {
  const validatedFields = StudyOptimizerSchema.safeParse({
    testDate: new Date(formData.get('testDate') as string),
    topics: formData.get('topics'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { testDate, topics } = validatedFields.data;
    const daysUntilTest = differenceInDays(testDate, new Date()) + 1;

    if (daysUntilTest <= 0) {
        return { error: 'Please select a future date for your test.' };
    }

    const result = await generateStudySchedule({
      testDate: format(testDate, 'yyyy-MM-dd'),
      topics,
      daysUntilTest,
    });
    return { studySchedule: result.studySchedule };
  } catch (e) {
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
