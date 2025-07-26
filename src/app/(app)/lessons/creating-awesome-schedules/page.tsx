
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PartyPopper, Coins, Loader2, Bot } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCoins } from '@/context/CoinContext';
import Confetti from 'react-confetti';
import { analyzeSchedule, ScheduleAnalysisOutput } from '@/ai/flows/schedule-analyzer';

type Task = {
  id: string;
  text: string;
  duration: number; // in 30-min blocks
  deadline: number; // day index (0=Mon, 6=Sun)
  color: string;
};

type TimeSlot = {
  id: string;
  day: number;
  time: string;
  task?: Task;
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'];

const taskSets: Task[][] = [
    [
        { id: 'math-1', text: 'Study for Math Test', duration: 2, deadline: 2, color: 'bg-blue-300/80' },
        { id: 'math-2', text: 'Study for Math Test', duration: 2, deadline: 2, color: 'bg-blue-300/80' },
        { id: 'eng-1', text: 'Write English Essay', duration: 3, deadline: 4, color: 'bg-green-300/80' },
        { id: 'eng-2', text: 'Write English Essay', duration: 3, deadline: 4, color: 'bg-green-300/80' },
        { id: 'sci-1', text: 'Science Project', duration: 2, deadline: 6, color: 'bg-yellow-300/80' },
        { id: 'sci-2', text: 'Science Project', duration: 2, deadline: 6, color: 'bg-yellow-300/80' },
        { id: 'sci-3', text: 'Science Project', duration: 2, deadline: 6, color: 'bg-yellow-300/80' },
    ],
    [
        { id: 'hist-1', text: 'History Reading', duration: 2, deadline: 1, color: 'bg-orange-300/80' },
        { id: 'hist-2', text: 'History Reading', duration: 2, deadline: 1, color: 'bg-orange-300/80' },
        { id: 'art-1', text: 'Art Project', duration: 4, deadline: 4, color: 'bg-purple-300/80' },
        { id: 'art-2', text: 'Art Project', duration: 4, deadline: 4, color: 'bg-purple-300/80' },
        { id: 'book-1', text: 'Book Report', duration: 3, deadline: 5, color: 'bg-pink-300/80' },
        { id: 'book-2', text: 'Book Report', duration: 3, deadline: 5, color: 'bg-pink-300/80' },
    ]
];

const generateInitialSchedule = (): TimeSlot[] => {
  let schedule: TimeSlot[] = [];
  DAYS.forEach((_, dayIndex) => {
    TIME_SLOTS.forEach((time, timeIndex) => {
      schedule.push({ id: `d${dayIndex}-t${timeIndex}`, day: dayIndex, time });
    });
  });
  return schedule;
};


export default function CreatingAwesomeSchedulesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<TimeSlot[]>(generateInitialSchedule());
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [feedback, setFeedback] = useState<ScheduleAnalysisOutput | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const { addCoins } = useCoins();
  const [coinsAwarded, setCoinsAwarded] = useState(false);
  const [currentTaskSetIndex, setCurrentTaskSetIndex] = useState(0);

  // === NEW STATE FOR SHOWING HINTS ===
  const [showHints, setShowHints] = useState(false);

  const schedulingTips = [
    "Try to avoid back-to-back long sessions.",
    "Leaving gaps helps with breaks and focus.",
    "Prioritize urgent tasks closer to their deadlines.",
    "Spread tasks evenly over the week for better productivity.",
    "Remember to balance work and rest!",
  ];
  // ===================================

  useEffect(() => {
    setTasks(taskSets[currentTaskSetIndex]);
  }, [currentTaskSetIndex]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotId: string | 'tasks') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = [...tasks, ...schedule.map(s => s.task).filter((t): t is Task => !!t)].find(t => t.id === taskId);
    
    if (task) {
      // Remove task from its current position
      const newSchedule = schedule.map(slot => slot.task?.id === taskId ? { ...slot, task: undefined } : slot);
      const newTasks = tasks.filter(t => t.id !== taskId);

      if (slotId === 'tasks') {
        setSchedule(newSchedule);
        setTasks([...newTasks, task]);
        return;
      }

      const slotIndex = newSchedule.findIndex(s => s.id === slotId);

      if (slotIndex !== -1) {
         const targetSlot = newSchedule[slotIndex];
         const slotsInDay = newSchedule.filter(s => s.day === targetSlot.day);
         const relativeIndex = slotsInDay.findIndex(s => s.id === slotId);
         
         if (relativeIndex + task.duration > slotsInDay.length) {
           alert("Not enough time in the schedule for this task here!");
           return;
         }

         const isSlotAvailable = newSchedule.slice(slotIndex, slotIndex + task.duration).every((s, i) =>
          !s.task && s.day === newSchedule[slotIndex].day
        );

        if (isSlotAvailable) {
          for (let i = 0; i < task.duration; i++) {
            newSchedule[slotIndex + i] = { ...newSchedule[slotIndex + i], task };
          }
          setSchedule(newSchedule);
          setTasks(newTasks);
        } else {
          alert("Another task is already scheduled in this spot!");
        }
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmitSchedule = async () => {
    if (tasks.length > 0) {
      alert("You still have tasks to schedule!");
      return;
    }
    setIsGeneratingFeedback(true);
    const formattedSchedule = schedule
      .filter(s => s.task)
      .map(s => ({
        day: DAYS[s.day],
        time: s.time,
        task: s.task!.text,
        deadline: `Due ${DAYS[s.task!.deadline]}`,
      }));
    
    try {
        const result = await analyzeSchedule({ schedule: JSON.stringify(formattedSchedule, null, 2) });
        setFeedback(result);
        if (result.isGood) {
            if (!coinsAwarded) {
                addCoins(35);
                setCoinsAwarded(true);
            }
        }
    } catch (e) {
        console.error(e);
        setFeedback({ isGood: false, feedback: 'There was an error analyzing your schedule. Please try again.'});
    } finally {
        setIsGeneratingFeedback(false);
        setGameState('finished');
    }
  }

  const resetLesson = () => {
    setCurrentTaskSetIndex((prev) => (prev + 1) % taskSets.length);
    setSchedule(generateInitialSchedule());
    setGameState('playing');
    setFeedback(null);
    setCoinsAwarded(false);
    setShowHints(false); // reset hints visibility on new lesson
  };
  
  if (gameState === 'intro') {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/lessons"><ArrowLeft /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Creating Awesome Schedules</h1>
          <p className="text-muted-foreground">Plan your week to beat procrastination and meet your deadlines!</p>
        </div>
      </div>
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Your Mission!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You have a busy week ahead! You need to study for a math test, write an essay, and work on a science project.
            Drag the task blocks onto your schedule to plan your week.
          </p>
          <img
            src="https://i.postimg.cc/L8JcMr28/2025-07-26-211908.png"
            alt="Friendly character ready to work"
            width={400}
            height={200}
            className="mx-auto rounded-lg bg-muted"
            data-ai-hint="student organizing"
          />
          <p className="text-sm text-muted-foreground">
            Tip: Try to spread your work out over the week. Don't leave it all for the last minute!
          </p>
          <Button onClick={() => setGameState('playing')}>Start Planning!</Button>
        </CardContent>
      </Card>
    </div>
  )
}

  if (gameState === 'finished') {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                <Link href="/lessons"><ArrowLeft /></Link>
                </Button>
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Schedule Review</h1>
                </div>
            </div>
             <Card className="text-center bg-accent">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <PartyPopper /> You've made a plan!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    { isGeneratingFeedback ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" />
                            <p>Our AI helper is reviewing your schedule...</p>
                        </div>
                    ) : feedback ? (
                        <>
                            <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
                                <Bot className="h-10 w-10 text-primary shrink-0"/>
                                <p className="font-medium text-accent-foreground text-left">{feedback.feedback}</p>
                            </div>
                            {feedback.isGood && (
                                <div className="flex items-center justify-center gap-2 font-semibold text-lg">
                                    <Coins className="h-6 w-6 text-yellow-500" />
                                    <span>+35 Coins! Great planning!</span>
                                </div>
                            )}
                        </>
                    ) : <p>No feedback available.</p> }
                    
                    <Button onClick={resetLesson} variant="outline" className="bg-background">Try Another Schedule</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/lessons"><ArrowLeft /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Plan Your Week</h1>
          <p className="text-muted-foreground">Drag tasks to the timeline. Deadlines are marked with a red line.</p>
        </div>
      </div>

      {/* ====== ADD HELP BUTTON AND HINTS HERE ====== */}
      <div className="flex items-center gap-4 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHints(!showHints)}
        >
          {showHints ? "Hide Tips" : "Show Tips"}
        </Button>
      </div>

      {showHints && (
        <Card className="mt-4 bg-background/80 p-4 border border-muted rounded-md max-w-md">
          <CardTitle className="text-lg mb-2">Scheduling Tips</CardTitle>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {schedulingTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </Card>
      )}
      {/* =============================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1 space-y-4">
            <Card
                onDrop={(e) => handleDrop(e, 'tasks')}
                onDragOver={handleDragOver}
            >
                <CardHeader>
                    <CardTitle>Your Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 min-h-[300px]">
                    <AnimatePresence>
                    {tasks.map(task => (
                        <motion.div
                          key={task.id}
                          layoutId={task.id}
                          draggable
                          title="Drag me to a day when you want to do this"
                          onDragStart={(e) => handleDragStart(e, task)}
                          className={cn(
                           "p-2 rounded-lg cursor-grab active:cursor-grabbing text-sm font-medium transition-transform hover:scale-105",
                          task.color
                        )}
                       >
                          {task.text} ({task.duration * 30}m)
                        </motion.div>
                    ))}
                    </AnimatePresence>
                     {tasks.length === 0 && (
                         <div className="text-center pt-8 space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">All tasks scheduled!</p>
                            <Button onClick={handleSubmitSchedule} disabled={isGeneratingFeedback}>
                                {isGeneratingFeedback && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Submit for Feedback
                            </Button>
                        </div>
                     )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Deadlines</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-2 text-sm">
                    <p><span className="font-bold text-blue-500">Math Test:</span> Due Wednesday</p>
                    <p><span className="font-bold text-green-500">English Essay:</span> Due Friday</p>
                    <p><span className="font-bold text-yellow-500">Science Project:</span> Due Sunday</p>
                 </CardContent>
            </Card>
        </div>
        
        <div className="lg:col-span-3">
            <Card>
                <CardContent className="grid grid-cols-7 gap-px bg-muted overflow-hidden rounded-lg border">
                    {DAYS.map((day, dayIndex) => (
                        <div key={day} className="text-center font-bold text-sm bg-background p-2 border-b">{day}</div>
                    ))}
                    {TIME_SLOTS.map((time, timeIndex) => (
                        <React.Fragment key={time}>
                            {DAYS.map((day, dayIndex) => {
                                const slotIndex = schedule.findIndex(s => s.day === dayIndex && s.time === time);
                                const slot = schedule[slotIndex];
                                if (!slot) return null;

                                const isFilled = !!slot.task;
                                const isStartOfTask = isFilled && schedule.find(s => s.task?.id === slot.task.id)?.id === slot.id;
                                if (isFilled && !isStartOfTask) return null;

                                const deadlineTask = taskSets[currentTaskSetIndex].find(t => t.deadline === slot.day);
                                const isDeadline = deadlineTask && TIME_SLOTS[TIME_SLOTS.length - 1] === slot.time;
                                
                                return (
                                    <div
                                        key={slot.id}
                                        onDrop={(e) => handleDrop(e, slot.id)}
                                        onDragOver={handleDragOver}
                                        className={cn(
                                            "relative border-r border-b border-dashed bg-background p-1 transition-colors min-h-[50px]",
                                            isFilled ? 'border-transparent' : 'hover:bg-accent/50',
                                            isDeadline && `border-r-4 border-r-red-500`
                                        )}
                                        style={{ 
                                            gridRowStart: timeIndex + 2,
                                            gridColumnStart: dayIndex + 1,
                                            gridRowEnd: isStartOfTask ? `span ${slot.task.duration}` : 'auto',
                                        }}
                                    >
                                        {!slot.task && <span className="text-muted-foreground text-xs">{slot.time}</span>}
                                        {slot.task && isStartOfTask && (
                                            <motion.div
                                                layoutId={slot.task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, slot.task!)}
                                                className={cn("p-2 rounded-md h-full flex items-center justify-center text-xs font-medium cursor-grab active:cursor-grabbing", slot.task.color)}
                                                >
                                                {slot.task.text}
                                            </motion.div>
                                        )}
                                    </div>
                                )
                            })}
                        </React.Fragment>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    