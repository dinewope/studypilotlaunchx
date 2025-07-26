import { format } from 'date-fns';

export const mockEvents: Record<string, { time: string; title: string; type: 'school' | 'fun' | 'chore' }[]> = {
  [format(new Date(), 'yyyy-MM-dd')]: [
    { time: '9:00 AM', title: 'Math Class', type: 'school' },
    { time: '3:30 PM', title: 'Soccer Practice', type: 'fun' },
    { time: '7:00 PM', title: 'Finish History Reading', type: 'school' },
  ],
  [format(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd')]: [
    { time: '10:00 AM', title: 'Science Project Due', type: 'school' },
    { time: '4:00 PM', title: 'Piano Lesson', type: 'fun' },
  ],
};
