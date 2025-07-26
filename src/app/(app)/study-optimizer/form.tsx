
'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createStudyPlan, StudyOptimizerState } from './actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

const StudyOptimizerSchema = z.object({
  testDate: z.date({
    required_error: 'Please select the date of your test.',
  }),
  topics: z.string().min(10, 'Please list the topics you need to study.'),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Plan
        </>
      )}
    </Button>
  );
}

export function StudyOptimizerForm() {
  const initialState: StudyOptimizerState = {};
  const [state, dispatch] = useActionState(createStudyPlan, initialState);

  const form = useForm<z.infer<typeof StudyOptimizerSchema>>({
    resolver: zodResolver(StudyOptimizerSchema),
    defaultValues: {
      topics: '',
    },
  });
  
  const formAction = form.handleSubmit(() => {
    const formData = new FormData();
    const data = form.getValues();
    if(data.testDate) {
        formData.append('testDate', data.testDate.toISOString());
    }
    formData.append('topics', data.topics);
    dispatch(formData);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Form {...form}>
        <form action={formAction} className="space-y-6">
          <FormField
            control={form.control}
            name="testDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>When is your test?</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What topics are on the test?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Photosynthesis, Cell division, Plant life cycles..."
                    className="resize-none"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton />
        </form>
      </Form>
      <div className="lg:mt-0">
        <Card className="bg-secondary/50 min-h-[300px]">
          <CardHeader>
            <CardTitle>Your Study Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {state.studySchedule ? (
              <div className="space-y-4">
                <pre className="whitespace-pre-wrap font-sans text-sm">{state.studySchedule}</pre>
                <div className="space-y-2 pt-4">
                  <Label htmlFor="incorporate-plan">How will you incorporate this in your schedule?</Label>
                  <Textarea id="incorporate-plan" placeholder="For example: I'll study after school on Mondays and Wednesdays..." className="bg-background"/>
                </div>
              </div>
            ) : state.error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{typeof state.error === 'string' ? state.error : 'Please check your inputs and try again.'}</AlertDescription>
              </Alert>
            ) : (
              <p className="text-sm text-muted-foreground">Your generated study plan will appear here once you submit the form.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
