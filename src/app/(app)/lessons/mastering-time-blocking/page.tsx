'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  PartyPopper,
  Coins,
  Play,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCoins } from '@/context/CoinContext';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

/**
 * Sidebar tips card
 */
function TimeBlockingTipsCard() {
  return (
    <Card className="w-full border-teal-300 bg-teal-50">
      <CardHeader>
        <CardTitle>⏰ Time Blocking Tips</CardTitle>
        <CardDescription>Make planning fun and effective!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ul className="list-disc list-inside text-sm">
          <li>🎯 Do the hardest task first while you’re fresh.</li>
          <li>⏲️ Schedule 5‑min break between blocks.</li>
          <li>🌈 Color‑code tasks for quick spotting.</li>
          <li>🧩 Mix chores and study to stay motivated.</li>
          <li>🎉 Celebrate small wins with a sticker!</li>
        </ul>
      </CardContent>
    </Card>
  );
}

type Task = { id: string; text: string; duration: number; type: 'school' | 'fun' | 'chore' };
type TimeSlot = { hour: number; task?: Task; isLocked?: boolean };

const taskSets: Task[][] = [
  [
    { id: 't1', text: 'Math Homework', duration: 2, type: 'school' },
    { id: 't2', text: 'Read a Book',    duration: 1, type: 'fun'    },
    { id: 't3', text: 'Science Quiz',   duration: 2, type: 'school' },
    { id: 't4', text: 'Tidy Room',      duration: 1, type: 'chore'  },
    { id: 't5', text: 'Practice Piano', duration: 2, type: 'fun'    },
  ],
  [
    { id: 't6', text: 'English Essay', duration: 2, type: 'school' },
    { id: 't7', text: 'Garden Water', duration: 1, type: 'chore'  },
    { id: 't8', text: 'Sketch Drawing', duration: 1, type: 'fun'  },
    { id: 't9', text: 'History Reading', duration: 2, type: 'school' },
  ],
];

const lockedTasks: Record<number, Task> = {
  15: { id: 'l1', text: 'Science Class', duration: 4, type: 'school' },
  18: { id: 'l2', text: 'Dinner',       duration: 2, type: 'chore'  },
};

function generateSchedule(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let i = 0; i < 16; i++) {
    slots.push({ hour: 15 + i * 0.5 });
  }
  Object.entries(lockedTasks).forEach(([h, task]) => {
    const start = slots.findIndex(s => s.hour === +h);
    if (start >= 0) {
      for (let k = 0; k < task.duration; k++) {
        slots[start + k] = { ...slots[start + k], task, isLocked: true };
      }
    }
  });
  return slots;
}

const taskColors: Record<string,string> = {
  school: 'bg-blue-300',
  fun:    'bg-green-300',
  chore:  'bg-yellow-300',
};

export default function MasteringTimeBlockingPage() {
  const { addCoins } = useCoins();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<TimeSlot[]>(generateSchedule());
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0,10));
  const [isFinished, setIsFinished] = useState(false);
  const [message, setMessage] = useState('');
  const [setIndex, setSetIndex] = useState(0);
  const [coinsAwarded, setCoinsAwarded] = useState(false);
  const { width, height } = useWindowSize();

  // Load tasks/schedule for date or defaults
  useEffect(() => {
    // Tasks
    const savedTasks = localStorage.getItem(`tasks-${selectedDate}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(taskSets[setIndex].map(t=>({ ...t })));
    }
    // Schedule
    const savedSchedule = localStorage.getItem(`sched-${selectedDate}`);
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    } else {
      setSchedule(generateSchedule());
    }
    setIsFinished(false);
    setMessage('');
    setCoinsAwarded(false);
  }, [selectedDate, setIndex]);

  const fmtHour = (h: number) => {
    const hr = Math.floor(h), mn = h % 1 ? '30' : '00';
    const pm = hr >= 12;
    const d = ((hr - 1) % 12) + 1;
    return `${d}:${mn} ${pm ? 'PM' : 'AM'}`;
  };
  const getDurText = (d: number) => {
    const hrs = Math.floor(d/2), mins = (d%2)*30;
    return `${hrs?hrs+'h ':' '}${mins?mins+'m':''}`.trim();
  };

  // Persist on change
  const persist = useCallback(() => {
    localStorage.setItem(`tasks-${selectedDate}`, JSON.stringify(tasks));
    localStorage.setItem(`sched-${selectedDate}`, JSON.stringify(schedule));
  }, [selectedDate, tasks, schedule]);

  useEffect(() => { if (tasks.length||schedule.length) persist(); }, [tasks, schedule, persist]);

  // Drag & drop handlers
  const onDragStart = (e: React.DragEvent, t: Task) => { e.dataTransfer.setData('taskId', t.id); };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent, idx: number|'tasks') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('taskId');
    const all = [...tasks, ...schedule.map(s=>s.task).filter(Boolean) as Task[]];
    const dropped = all.find(x=>x.id===id);
    if (!dropped) return;
    // clear old
    const cleared = schedule.map(s=> s.task?.id===id ? { ...s, task:undefined } : s);
    setSchedule(cleared);
    const rem = tasks.filter(t=>t.id!==id);
    if (idx==='tasks') { setTasks([...rem, dropped]); return; }
    const canPlace = cleared.slice(idx, idx+dropped.duration)
      .every(s=>!s.task && !s.isLocked) && idx+dropped.duration<=cleared.length;
    if (canPlace) {
      const upd = [...cleared];
      for(let k=0;k<dropped.duration;k++) upd[idx+k]={ ...upd[idx+k], task:dropped };
      setSchedule(upd);
      setTasks(rem);
      const free=upd.filter(s=>!s.task&&!s.isLocked).length;
      if(free===0){
        const ord=upd.map(s=>s.task).filter(Boolean) as Task[];
        const firstWork=ord.findIndex(t=>t.type!=='fun');
        const lastFun=ord.map(t=>t.type).lastIndexOf('fun');
        setMessage(lastFun<firstWork?
          'You worked then played—great job!':
          'Try scheduling chores before fun next time.'
        );
        setIsFinished(true);
        if(!coinsAwarded){addCoins(20);setCoinsAwarded(true);}      }
    } else {
      alert('Not enough space or locked.');
      setTasks([...rem,dropped]);
    }
  };

  // New task
  const addNewTask = () => {
    if(!newTaskText.trim())return;
    const t:Task={ id:`custom-${Date.now()}`, text:newTaskText.trim(), duration:1, type:'fun' };
    setTasks([...tasks,t]);
    setNewTaskText('');
    addCoins(5);
  };

  // Reset for next set
  const reset = () => {
    setSetIndex(i=>(i+1)%taskSets.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <header className="flex items-center mb-6">
        <Button asChild variant="outline" size="icon">
          <Link href="/lessons"><ArrowLeft/></Link>
        </Button>
        <div className="ml-4 flex space-x-4">
          <h1 className="text-4xl font-bold">Mastering Time Blocking</h1>
          <input
            type="date"
            className="border p-1 rounded"
            value={selectedDate}
            onChange={e=>setSelectedDate(e.target.value)}
          />
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tasks */}
        <section className="lg:col-span-1 flex flex-col">
          <Card onDrop={e=>handleDrop(e,'tasks')} onDragOver={onDragOver} className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>Drag to schedule</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2 overflow-y-auto">
              <AnimatePresence>
                {tasks.map(t=>(
                  <motion.div
                    key={t.id}
                    layoutId={t.id}
                    draggable
                    onDragStart={e=>onDragStart(e,t)}
                    className={cn('p-3 rounded-lg cursor-grab',taskColors[t.type])}
                    initial={{opacity:0,y:-10}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,scale:0.5}}
                  >
                    <div className="flex justify-between">
                      <span>{t.text}</span>
                      <span className="text-xs">{getDurText(t.duration)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Input placeholder="New task..." value={newTaskText} onChange={e=>setNewTaskText(e.target.value)}/>
              <Button onClick={addNewTask} variant="outline"><Play className="mr-2"/>Add</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Schedule */}
        <section className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Afternoon Schedule</CardTitle>
              <CardDescription>3:00 PM – 11:00 PM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {schedule.map((s,i)=>{
                const filled=!!s.task;
                const start=filled&&(i===0||schedule[i-1].task?.id!==s.task!.id);
                if(filled&&!start)return null;
                return (
                  <div key={s.hour} className="flex gap-2">
                    <div className="w-20 text-right text-gray-500">{fmtHour(s.hour)}</div>
                    <div
                      onDrop={s.isLocked?undefined:e=>handleDrop(e,i)}
                      onDragOver={s.isLocked?undefined:onDragOver}
                      className={cn(
                        'flex-1 border-2 rounded p-2',
                        s.isLocked
                          ? 'bg-gray-300 border-gray-300'
                          : 'border-dashed border-gray-400 hover:border-blue-500'
                      )}
                      style={{height:filled?`${s.task!.duration*2}rem`:'2rem'}}
                    >
                      {filled&&(
                        <motion.div
                          layoutId={s.task!.id}
                          draggable={!s.isLocked}
                          onDragStart={e=>onDragStart(e,s.task!)}
                          className={cn('h-full p-2 rounded flex items-center justify-center',taskColors[s.task!.type])}
                        >{s.task!.text}</motion.div>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
          <AnimatePresence>
            {isFinished && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <Card className="text-center bg-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex justify-center items-center gap-2">
                      <PartyPopper className="text-indigo-600"/> Nice Work!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{message}</p>
                    <div className="flex justify-center items-center gap-2 text-lg font-semibold">
                      <Coins className="text-yellow-500"/>+20 Coins
                    </div>
                    <Button onClick={reset}>Next Set</Button>
                  </CardContent>
                </Card>
                <Confetti width={width} height={height}/>  
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <div className="mt-8"><TimeBlockingTipsCard/></div>
    </div>
  );
}
