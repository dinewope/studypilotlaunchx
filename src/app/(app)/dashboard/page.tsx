
'use client';

import Link from 'next/link';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, BrainCircuit } from 'lucide-react';
import { isAfter, isToday, parseISO, format } from 'date-fns';
import { useEvents } from '@/context/EventsContext';

interface Deadline {
  due: string;
  task: string;
}

export default function Dashboard() {
  const { events } = useEvents();
  const [upcomingDeadlines, setUpcomingDeadlines] = React.useState<Deadline[]>([]);

  React.useEffect(() => {
    const deadlines = Object.entries(events)
      .flatMap(([date, dayEvents]) =>
        dayEvents.map(event => ({ ...event, date: parseISO(date) }))
      )
      .filter(event => isToday(event.date) || isAfter(event.date, new Date()))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3)
      .map(event => ({
        due: format(event.date, 'eeee'),
        task: event.title,
      }));

    setUpcomingDeadlines(deadlines);
  }, [events]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome!
        </h1>
        <p className="text-muted-foreground text-base">
          Ready to have a great and productive day?
        </p>
      </div>

      {/* Upcoming Deadlines */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Stay ahead of your schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground text-sm font-bold rounded-md px-4 py-2 text-center w-28 shrink-0">
                    {item.due}
                  </div>
                  <p className="text-base">{item.task}</p>
                </li>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No upcoming deadlines. Great job staying on top of things!
              </p>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Cards Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1 */}
        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <CardTitle>Your Study Buddy</CardTitle>
            <CardDescription>
              Learn a new skill to supercharge your week.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative h-52 w-full rounded-lg overflow-hidden">
              <img
                src="https://i.postimg.cc/q7P0YpKr/2025-07-26-211801.png"
                alt="Your Study Buddy"
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/lessons">
                Explore Lessons <BookOpenCheck className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <CardTitle>Your AI Coach</CardTitle>
            <CardDescription>
              Let our smart assistants help you plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative h-52 w-full rounded-lg overflow-hidden">
              <img
                src="https://i.postimg.cc/W4PXfK4K/2025-07-26-212051.png"
                alt="Your AI Coach"
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
          <CardContent>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/study-optimizer">
                Get Planning Help <BrainCircuit className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}