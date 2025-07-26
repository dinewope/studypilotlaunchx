
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ListTodo, Target, LayoutGrid, GanttChart, BellOff, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  href?: string;
}

const lessons: Lesson[] = [
  {
    icon: ListTodo,
    title: 'Prioritization Power',
    description: 'Learn how to decide what\'s most important and do it first!',
    color: 'bg-primary/80',
    href: '/lessons/prioritization-power',
  },
  {
    icon: Target,
    title: 'Setting SMART Goals',
    description: 'Turn your big dreams into small, achievable steps.',
    color: 'bg-accent/80',
    href: '/lessons/setting-smart-goals',
  },
  {
    icon: LayoutGrid,
    title: 'Mastering Time Blocking',
    description: 'Create a super-powered schedule by giving every hour a job.',
    color: 'bg-secondary',
    href: '/lessons/mastering-time-blocking',
  },
  {
    icon: GanttChart,
    title: 'Creating Awesome Schedules',
    description: 'Build a weekly plan that includes school, fun, and free time.',
    color: 'bg-primary/60',
    href: '/lessons/creating-awesome-schedules',
  },
  {
    icon: BellOff,
    title: 'Defeating Distractions',
    description: 'Discover your focus kryptonite and learn how to defeat it.',
    color: 'bg-accent/60',
    href: '/lessons/defeating-distractions',
  },
  {
    icon: Users,
    title: 'The Art of Delegation',
    description: 'Understand when and how to ask for help with your tasks.',
    color: 'bg-secondary/80',
    href: '/lessons/the-art-of-delegation',
  },
];

export default function LessonsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Studypilot Lessons</h1>
        <p className="text-muted-foreground">Pick a lesson to start your journey to becoming a time management master!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.title} className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
               <div className={`p-4 rounded-lg ${lesson.color}`}>
                <lesson.icon className="h-8 w-8 text-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle>{lesson.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{lesson.description}</CardDescription>
            </CardContent>
            <CardFooter>
               <Button asChild className="w-full">
                {lesson.href ? (
                    <Link href={lesson.href}>
                        Start Lesson <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                ) : (
                    <button disabled>
                        Start Lesson <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
