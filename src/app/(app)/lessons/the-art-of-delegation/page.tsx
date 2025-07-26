
'use client';

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PartyPopper, Coins, User, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCoins } from "@/context/CoinContext";

type Delegate = "you" | "mom" | "dad" | "sister" | "brother";

type Task = {
  id: string;
  text: string;
  correctDelegate: Delegate;
  feedback: string;
};

const taskSets: Task[][] = [
  [
    {
      id: "task-1",
      text: "Bake a cake for the party",
      correctDelegate: "mom",
      feedback: "Mom is great at following recipes! Good choice.",
    },
    {
      id: "task-2",
      text: "Fix the broken game controller",
      correctDelegate: "dad",
      feedback:
        "Dad is great at fixing things. He's the perfect person for this!",
    },
    {
      id: "task-3",
      text: "Research fun party game ideas",
      correctDelegate: "sister",
      feedback:
        "Your sister is super creative and great at finding fun ideas online!",
    },
    {
      id: "task-4",
      text: "Finish my math homework",
      correctDelegate: "you",
      feedback:
        "This is your homework, so it's your responsibility to finish it.",
    },
    {
      id: "task-5",
      text: "Clean my room before guests arrive",
      correctDelegate: "you",
      feedback: "Keeping your own space tidy is a great way to help out.",
    },
    {
      id: "task-6",
      text: "Solve a tricky science question",
      correctDelegate: "dad",
      feedback:
        "It's wise to ask for help when you're stuck. Dad can help you.",
    },
  ],
];

export default function ArtOfDelegationPage() {
  const [siblings, setSiblings] = useState<("sister" | "brother")[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [delegatedTasks, setDelegatedTasks] = useState<
    Record<Delegate, Task[]>
  >({
    you: [],
    mom: [],
    dad: [],
    sister: [],
    brother: [],
  });
  const [feedback, setFeedback] = useState<
    Record<string, { correct: boolean; text: string }>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentTaskSetIndex, setCurrentTaskSetIndex] = useState(0);
  const { addCoins } = useCoins();
  const [coinsAwarded, setCoinsAwarded] = useState(false);

  useEffect(() => {
    setTasks(taskSets[currentTaskSetIndex]);
    setDelegatedTasks({
      you: [],
      mom: [],
      dad: [],
      sister: [],
      brother: [],
    });
    setFeedback({});
    setIsSubmitted(false);
    setCoinsAwarded(false);
  }, [currentTaskSetIndex]);

  // build delegates list dynamically based on siblings
  const baseDelegates = [
    { id: "you", name: "You", skills: "Your tasks to own!", avatar: "🧑" },
    {
      id: "mom",
      name: "Mom",
      skills: "Good at organizing & shopping",
      avatar: "👩‍🍳",
    },
    {
      id: "dad",
      name: "Dad",
      skills: "Good at fixing things & building",
      avatar: "👨‍🔧",
    },
  ];
  const delegates = [
    ...baseDelegates,
    ...siblings.map((sib) =>
      sib === "sister"
        ? {
            id: "sister",
            name: "Big Sister",
            skills: "Good at research & being creative",
            avatar: "👩‍🎨",
          }
        : {
            id: "brother",
            name: "Big Brother",
            skills: "Good at helping & organizing",
            avatar: "👨‍🎓",
          }
    ),
  ] as { id: Delegate; name: string; skills: string; avatar: string }[];

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    task: Task
  ) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    delegateId: Delegate | "tasks"
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = [...tasks, ...Object.values(delegatedTasks).flat()].find(
      (t) => t.id === taskId
    );

    if (task && !isSubmitted) {
      // Remove from all
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setDelegatedTasks((prev) => {
        const copy = { ...prev };
        (Object.keys(copy) as Delegate[]).forEach((key) => {
          copy[key] = copy[key].filter((t) => t.id !== taskId);
        });
        return copy;
      });

      if (delegateId === "tasks") {
        setTasks((prev) => [...prev, task]);
      } else {
        setDelegatedTasks((prev) => ({
          ...prev,
          [delegateId]: [...prev[delegateId], task],
        }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const checkAnswers = () => {
    const newFeedback: Record<string, { correct: boolean; text: string }> = {};
    let allCorrect = true;
    for (const delegate in delegatedTasks) {
      delegatedTasks[delegate as Delegate].forEach((task) => {
        if (task.correctDelegate === delegate) {
          newFeedback[task.id] = { correct: true, text: task.feedback };
        } else {
          newFeedback[task.id] = {
            correct: false,
            text: `Hmm, maybe someone else is better for this?`,
          };
          allCorrect = false;
        }
      });
    }

    if (
      Object.values(delegatedTasks).flat().length !==
      taskSets[currentTaskSetIndex].length
    ) {
      allCorrect = false;
    }

    setFeedback(newFeedback);
    setIsSubmitted(true);

    if (allCorrect && !coinsAwarded) {
      addCoins(30);
      setCoinsAwarded(true);
    }
  };

  const resetLesson = () => {
    setCurrentTaskSetIndex((prev) => (prev + 1) % taskSets.length);
  };

  const isAllCorrect = isSubmitted && Object.values(feedback).every((f) => f.correct);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/lessons">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          {/* Buttons to add siblings */}
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() =>
                setSiblings((prev) =>
                  prev.includes("sister") ? prev : [...prev, "sister"]
                )
              }
            >
              Add Sister
            </Button>
            <Button
              onClick={() =>
                setSiblings((prev) =>
                  prev.includes("brother") ? prev : [...prev, "brother"]
                )
              }
            >
              Add Brother
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Lesson: The Art of Delegation
          </h1>
          <p className="text-muted-foreground">
            Plan a Family Fun Night by delegating tasks to the right person!
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* TASK LIST */}
            <Card
              className="lg:col-span-1"
              onDrop={(e) => handleDrop(e, "tasks")}
              onDragOver={handleDragOver}
            >
              <CardHeader>
                <CardTitle>Fun Night Tasks</CardTitle>
                <CardDescription>Drag tasks to a person.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 min-h-[300px]">
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layoutId={task.id}
                      draggable={!isSubmitted}
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="p-3 rounded-lg bg-secondary cursor-grab active:cursor-grabbing"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <p className="font-medium text-sm">{task.text}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* DELEGATES */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {delegates.map((del) => (
                <Card
                  key={del.id}
                  onDrop={(e) => handleDrop(e, del.id)}
                  onDragOver={handleDragOver}
                  className={cn(
                    "rounded-lg border-2 border-dashed p-4 space-y-2 min-h-[200px] transition-colors",
                    isSubmitted
                      ? "border-transparent"
                      : "border-muted hover:border-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{del.avatar}</span>
                    <div>
                      <h3 className="font-bold">{del.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {del.skills}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <AnimatePresence>
                      {delegatedTasks[del.id].map((task) => (
                        <motion.div
                          key={task.id}
                          layoutId={task.id}
                          draggable={!isSubmitted}
                          onDragStart={(e) => handleDragStart(e, task)}
                          className="p-3 rounded-lg bg-card cursor-grab active:cursor-grabbing"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <p className="font-medium text-sm">{task.text}</p>
                          {isSubmitted && (
                            <p
                              className={cn(
                                "text-xs mt-1",
                                feedback[task.id]?.correct
                                  ? "text-green-600"
                                  : "text-red-600"
                              )}
                            >
                              {feedback[task.id]?.text}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={checkAnswers} disabled={tasks.length > 0 || isSubmitted}>
              Check My Work
            </Button>
            <Button onClick={resetLesson} variant="outline">
              Reset Lesson
            </Button>
          </div>

          {/* RESULT CARD */}
          {isSubmitted && (
            <Card className="mt-6 text-center bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  {isAllCorrect ? (
                    <>
                      <PartyPopper /> Great Teamwork!
                    </>
                  ) : (
                    "Good Try!"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-lg font-medium text-accent-foreground">
                  {isAllCorrect
                    ? "You did an amazing job delegating! Teamwork makes the dream work!"
                    : "Some tasks could be delegated better. Think about each person’s skills and try again!"}
                </p>
                {isAllCorrect && (
                  <div className="flex items-center justify-center gap-2 font-semibold text-lg">
                    <Coins className="h-6 w-6 text-yellow-500" />
                    <span>+30 Coins!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block bg-muted rounded p-4 h-fit">
          <h2 className="text-xl font-semibold mb-2">Delegation Tips</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Think about each person’s skills before assigning.</li>
            <li>Tasks you can do yourself should go to You.</li>
            <li>Big tasks? Give them to someone experienced.</li>
            <li>Everyone helping makes Fun Night better!</li>
            <li>You can even add a sister or brother if you have more helpers!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

          