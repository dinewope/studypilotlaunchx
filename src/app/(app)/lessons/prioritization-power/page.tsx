'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  PartyPopper,
  Coins,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCoins } from '@/context/CoinContext';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Lesson Tips card to help improve prioritization skills
function LessonTipsCard() {
  return (
    <Card className="mt-8 border-indigo-300 bg-indigo-50">
      <CardHeader>
        <CardTitle>📘 Lesson Tips</CardTitle>
        <CardDescription>How to prioritize like a pro!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>📝 Write down all tasks before sorting.</li>
          <li>⏰ Use a timer: spend 2 minutes on each urgent item.</li>
          <li>🔍 Ask: "Will this matter tomorrow?" for importance.</li>
          <li>↔️ Break big tasks into smaller, actionable steps.</li>
          <li>🎨 Color-code by quadrant to see urgency at a glance.</li>
        </ul>
      </CardContent>
    </Card>
  );
}

type Task = {
  id: string;
  text: string;
  correctQuadrant: Quadrant;
};

type Quadrant = 'do' | 'schedule' | 'delegate' | 'delete';

const taskSets: Task[][] = [
  [
    { id: 'task-1', text: 'Math homework due tomorrow', correctQuadrant: 'do' },
    { id: 'task-2', text: 'Start science fair project due in 2 weeks', correctQuadrant: 'schedule' },
    { id: 'task-3', text: "Reply to your friend's text about the weekend", correctQuadrant: 'delegate' },
    { id: 'task-4', text: 'Watch a new episode of your favorite cartoon', correctQuadrant: 'delete' },
    { id: 'task-5', text: 'Study for the history quiz on Friday', correctQuadrant: 'do' },
    { id: 'task-6', text: 'Plan your birthday party for next month', correctQuadrant: 'schedule' },
    { id: 'task-7', text: "Take out the recycling bin because it's full", correctQuadrant: 'delegate' },
    { id: 'task-8', text: 'Scroll through social media for 15 minutes', correctQuadrant: 'delete' },
  ],
  [
    { id: 'task-a', text: 'Finish English reading assignment due tomorrow', correctQuadrant: 'do' },
    { id: 'task-b', text: 'Research summer camp options', correctQuadrant: 'schedule' },
    { id: 'task-c', text: 'Ask mom to help buy a birthday gift for a friend', correctQuadrant: 'delegate' },
    { id: 'task-d', text: 'Daydream about what you want for your birthday', correctQuadrant: 'delete' },
    { id: 'task-e', text: 'Pack your backpack for school tomorrow', correctQuadrant: 'do' },
    { id: 'task-f', text: 'Decide what movie to watch on Friday night', correctQuadrant: 'schedule' },
    { id: 'task-g', text: 'Remind your dad about your soccer game on Saturday', correctQuadrant: 'delegate' },
    { id: 'task-h', text: 'Check if you have any new likes on your game profile', correctQuadrant: 'delete' },
  ],
];

const quadrants: {
  id: Quadrant;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}[] = [
  { id: 'do', title: 'Do Now', description: 'Urgent & Important', color: 'border-green-500', bgColor: 'bg-green-100' },
  { id: 'schedule', title: 'Plan It', description: 'Not Urgent & Important', color: 'border-blue-500', bgColor: 'bg-blue-100' },
  { id: 'delegate', title: 'Ask for Help', description: 'Urgent & Not Important', color: 'border-yellow-500', bgColor: 'bg-yellow-100' },
  { id: 'delete', title: 'Drop It', description: 'Not Urgent & Not Important', color: 'border-red-500', bgColor: 'bg-red-100' },
];

export default function PrioritizationPowerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quadrantTasks, setQuadrantTasks] = useState<Record<Quadrant, Task[]>>({ do: [], schedule: [], delegate: [], delete: [] });
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentTaskSetIndex, setCurrentTaskSetIndex] = useState(0);
  const { addCoins } = useCoins();
  const [coinsAwarded, setCoinsAwarded] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    setTasks(taskSets[currentTaskSetIndex]);
    setQuadrantTasks({ do: [], schedule: [], delegate: [], delete: [] });
    setFeedback({});
    setIsSubmitted(false);
    setCoinsAwarded(false);
  }, [currentTaskSetIndex]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.currentTarget.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.1)' },
      { transform: 'scale(1)' }
    ], { duration: 300 });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, quadrantId: Quadrant | 'tasks') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const allTasks = [...tasks, ...Object.values(quadrantTasks).flat()];
    const task = allTasks.find(t => t.id === taskId);
    if (!task || isSubmitted) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setQuadrantTasks(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => updated[k as Quadrant] = updated[k as Quadrant].filter(t => t.id !== taskId));
      if (quadrantId !== 'tasks') updated[quadrantId].push(task);
      return updated;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const checkAnswers = () => {
    const newFeedback: Record<string, 'correct' | 'incorrect'> = {};
    let allCorrect = true;
    Object.entries(quadrantTasks).forEach(([key, list]) => {
      list.forEach(task => {
        if (task.correctQuadrant === key) newFeedback[task.id] = 'correct'; else { newFeedback[task.id] = 'incorrect'; allCorrect = false; }
      });
    });
    setFeedback(newFeedback);
    setIsSubmitted(true);
    if (allCorrect && !coinsAwarded) { addCoins(30); setCoinsAwarded(true); }
  };

  const resetLesson = () => setCurrentTaskSetIndex(prev => (prev + 1) % taskSets.length);

  const isAllCorrect = isSubmitted && Object.values(feedback).every(v => v === 'correct') && coinsAwarded;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/lessons"><ArrowLeft /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Prioritization Power</h1>
          <p className="text-muted-foreground">Learn to sort tasks using fun, interactive exercises!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Task List */}
        <Card onDrop={e => handleDrop(e, 'tasks')} onDragOver={handleDragOver} className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>Drag into the right box!</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] space-y-2">
            <AnimatePresence>
              {tasks.map(task => (
                <motion.div key={task.id} draggable={!isSubmitted} onDragStart={e => handleDragStart(e, task)} className="p-2 bg-secondary rounded cursor-grab" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }}>{task.text}</motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Quadrants */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map(q => (
            <div key={q.id} onDrop={e => handleDrop(e, q.id)} onDragOver={handleDragOver} className={`${q.color} ${q.bgColor} border-2 p-4 rounded`}>
              <h3 className="font-bold">{q.title}</h3>
              <p className="text-sm">{q.description}</p>
              <div className="space-y-1 mt-2">
                <AnimatePresence>
                  {quadrantTasks[q.id].map(task => (
                    <motion.div key={task.id} draggable={!isSubmitted} onDragStart={e => handleDragStart(e, task)} className="flex justify-between p-2 bg-card rounded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{task.text}{isSubmitted && (feedback[task.id] === 'correct' ? <CheckCircle className="text-green-500"/> : <XCircle className="text-red-500"/>)}</motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={checkAnswers} disabled={isSubmitted}>Submit</Button>
        <Button onClick={resetLesson} variant="outline">Start Again</Button>
      </div>

      {isSubmitted && (
        <Card className="text-center bg-accent">
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-2">{isAllCorrect ? <><PartyPopper /> Well Done!</> : 'Try Again!'}</CardTitle>
          </CardHeader>
          <CardFooter>
            {isAllCorrect && <Confetti width={width} height={height}/>}
            <p>{isAllCorrect ? 'You earned +30 Coins!' : 'Review and try again to master it!'}</p>
          </CardFooter>
        </Card>
      )}

      {/* Lesson Tips for better prioritization */}
      <LessonTipsCard />
    </div>
  );
}