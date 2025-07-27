
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Award, Lightbulb, Coins, CheckSquare, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCoins } from '@/context/CoinContext';

type ItemType = 
    | { type: 'distraction', text: string }
    | { type: 'productive', text: string };

interface OnScreenItem {
  key: number;
  item: ItemType;
  x: number;
  y: number;
  timestamp: number;
}

interface GameScenario {
    task: string;
    distractions: string[];
    productiveThoughts: string[];
}

const scenarios: GameScenario[] = [
    {
        task: "Write a book report on 'Charlotte's Web'.",
        distractions: ["Check if my favorite show is on.", "I should go get a snack.", "I wonder what new videos are online.", "Let's see what my friends are texting about.", "Maybe I'll just read one more chapter for fun instead."],
        productiveThoughts: ["What's the main theme of the book?", "I should jot down the main characters.", "Let's make an outline first.", "What's a good opening sentence?", "I'll re-read the part about the fair."],
    },
    {
        task: "Study for a science test on the solar system.",
        distractions: ["Is it time to play video games yet?", "I'm getting a little sleepy.", "I'll just look at pictures of cats for a minute.", "I should practice my drawing.", "Let me check the weather for tomorrow."],
        productiveThoughts: ["How many planets are there again?", "I'll make flashcards for each planet.", "What's a fun fact about Mars?", "Let me draw a diagram of the solar system.", "I'll review my notes from class."],
    },
    {
        task: "Clean my room before my friend comes over.",
        distractions: ["I'll just lie down for five minutes.", "This old toy is cool, I should play with it.", "Let me try on all my clothes.", "I should see what's in the fridge.", "I'll listen to one more song first."],
        productiveThoughts: ["I should start with the big stuff, like my bed.", "I'll make a pile for toys and a pile for clothes.", "Where does this book belong?", "Let me put all the trash in a bag.", "I can listen to music while I work!"],
    },
];

const GAME_DURATION = 35; // in seconds
const FOCUS_LOSS_RATE = 5; // points per second a distraction is active
const DISTRACTION_LIFESPAN = 4000; // ms

export default function DefeatingDistractionsPage() {
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [focus, setFocus] = useState(100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [onScreenItems, setOnScreenItems] = useState<OnScreenItem[]>([]);
  const { addCoins } = useCoins();
  const [coinsAwarded, setCoinsAwarded] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<GameScenario>(scenarios[0]);
  const [clickedItems, setClickedItems] = useState<Set<number>>(new Set());
  const [misclickedDistractions, setMisclickedDistractions] = useState<string[]>([]);
  
  const [availableDistractions, setAvailableDistractions] = useState<string[]>([]);
  const [availableProductive, setAvailableProductive] = useState<string[]>([]);

  const setupNewGame = useCallback(() => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
    setAvailableDistractions([...randomScenario.distractions].sort(() => 0.5 - Math.random()));
    setAvailableProductive([...randomScenario.productiveThoughts].sort(() => 0.5 - Math.random()));
  }, []);

  useEffect(() => {
    setupNewGame();
  }, [setupNewGame]);

  const spawnItem = useCallback(() => {
    let currentDistractions = availableDistractions;
    let currentProductive = availableProductive;

    if (currentDistractions.length === 0) {
      currentDistractions = [...currentScenario.distractions].sort(() => 0.5 - Math.random());
      setAvailableDistractions(currentDistractions);
    }
    if (currentProductive.length === 0) {
      currentProductive = [...currentScenario.productiveThoughts].sort(() => 0.5 - Math.random());
      setAvailableProductive(currentProductive);
    }
    
    setOnScreenItems(prev => {
        let newItem: ItemType | null = null;
        const productiveChance = 0.45;

        if (Math.random() < productiveChance) {
            const thought = currentProductive.pop()!;
            newItem = { type: 'productive', text: thought };
            setAvailableProductive([...currentProductive]);
        } else {
            const distraction = currentDistractions.pop()!;
            newItem = { type: 'distraction', text: distraction };
            setAvailableDistractions([...currentDistractions]);
        }
        
        if (!newItem) return prev;

        const newOnScreenItem: OnScreenItem = {
          key: Date.now(),
          item: newItem,
          x: Math.random() * 75 + 10,  // ensures x is between 10% and 85%,
          y: Math.random() * 75 + 10,  // ensures x is between 10% and 85%,
          timestamp: Date.now(),
        };
        return [...prev, newOnScreenItem]
    });
  }, [availableDistractions, availableProductive, currentScenario]);
  
  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing' || focus <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('finished');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawner = setInterval(spawnItem, 1500);

    const focusManager = setInterval(() => {
        const now = Date.now();
        let focusLoss = 0;
        
        setOnScreenItems(currentItems => {
            const activeItems = currentItems.filter(i => now - i.timestamp < DISTRACTION_LIFESPAN);
            activeItems.forEach(i => {
                 if (i.item.type === 'distraction' && now - i.timestamp > 1000) {
                    focusLoss += FOCUS_LOSS_RATE / 10;
                }
            })
            return activeItems;
        });

        setFocus(prev => {
            const newFocus = Math.max(0, prev - focusLoss)
            if (newFocus <= 0) {
                 setGameState('finished');
            }
            return newFocus
        });

    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(focusManager);
    };
  }, [gameState, focus, spawnItem]);

  // Award coins on game finish
  useEffect(() => {
    if (gameState === 'finished' && !coinsAwarded && score >= 60) {
      addCoins(20);
      setCoinsAwarded(true);
    }
  }, [gameState, score, coinsAwarded, addCoins]);


  const handleItemClick = (clickedItem: OnScreenItem) => {
    if (clickedItems.has(clickedItem.key)) return;

    if (clickedItem.item.type === 'productive') {
        // Correct click
        setScore(prev => prev + 10);
        setFocus(prev => Math.min(100, prev + 5));
    } else {
        // Incorrect click (distraction)
        setScore(prev => Math.max(0, prev - 5));
        setFocus(prev => Math.max(0, prev - 10));
        setMisclickedDistractions(prev => [...prev, clickedItem.item.text]);
    }
    
    setClickedItems(prev => new Set(prev).add(clickedItem.key));

    setTimeout(() => {
        setOnScreenItems(prev => prev.filter(i => i.key !== clickedItem.key));
        setClickedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(clickedItem.key);
            return newSet;
        });
    }, 300);
  };

  const resetGame = () => {
    setGameState('playing');
    setFocus(100);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setOnScreenItems([]);
    setCoinsAwarded(false);
    setMisclickedDistractions([]);
    setupNewGame();
  }
  
  const finalMessage = score >= 150 ? "Amazing focus! You're a true Focus Champion!" :
                       score >= 70 ? "Great job! You focused on the helpful thoughts." :
                       "Good try! Keep practicing and you'll become a focus master.";

  return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* LEFT SIDE: Game UI */}
    <div className="md:col-span-2 space-y-4">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/lessons"><ArrowLeft /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Focus Quest: Catch the Good Thoughts!
          </h1>
          <p className="text-muted-foreground">
            Click on the helpful thoughts to boost your focus. Ignore the distractions!
          </p>
        </div>
      </div>

      {gameState === 'playing' ? (
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Focus Meter</span>
                </div>
                <Progress value={focus} />
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Time Left</div>
                <div className="text-3xl font-bold text-primary">{timeLeft}s</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Score</div>
                <div className="text-3xl font-bold text-primary">{score}</div>
              </div>
            </div>
            <Card className="bg-background border-primary border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <CheckSquare className="h-6 w-6 text-primary" />
                  Your Main Task
                </CardTitle>
                <CardDescription className="font-semibold text-foreground text-base">
                  {currentScenario.task}
                </CardDescription>
              </CardHeader>
            </Card>
          </CardHeader>
          <CardContent className="relative h-[500px] bg-secondary rounded-b-lg overflow-hidden border-4 border-dashed border-muted">
            <AnimatePresence>
              {onScreenItems.map((i) => {
                const isClicked = clickedItems.has(i.key);
                const isCorrectClick = isClicked && i.item.type === 'productive';
                const isIncorrectClick = isClicked && i.item.type === 'distraction';

                return (
                  <motion.div
                    key={i.key}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'absolute p-2 rounded-lg shadow-lg cursor-pointer hover:bg-accent bg-background',
                      isCorrectClick && 'bg-green-500/80 text-white',
                      isIncorrectClick && 'bg-red-500/80 text-white'
                    )}
                    style={{ left: `${i.x}%`, top: `${i.y}%` }}
                    onClick={() => handleItemClick(i)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-medium text-foreground')}>{i.item.text}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center bg-accent">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Award /> Quest Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold">Your Final Score: {score}</p>
            <p className="font-medium text-lg text-accent-foreground">{finalMessage}</p>
            {score >= 60 && (
              <div className="flex items-center justify-center gap-2 font-semibold text-lg">
                <Coins className="h-6 w-6 text-yellow-500" />
                <span>+20 Coins!</span>
              </div>
            )}
            {misclickedDistractions.length > 0 && (
              <Card className="text-left bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" />
                    Distractions You Clicked
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Next time, try to ignore these thoughts. They pull you away from your task!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {misclickedDistractions.map((text, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            <p className="text-sm text-muted-foreground">
              The best way to stay focused is to ignore distracting thoughts and hold onto the helpful ones!
            </p>
            <Button onClick={resetGame} variant="outline" className="bg-background">
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>

    {/* RIGHT SIDE: Tips Sidebar */}
    <div className="bg-muted rounded p-4 hidden md:block">
      <h2 className="text-xl font-semibold mb-2">Tips to Stay Focused</h2>
      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
        <li>Click only on helpful thoughts to boost your focus.</li>
        <li>Avoid distractions to keep your focus meter high.</li>
        <li>Try to finish the task before time runs out.</li>
        <li>Practice regularly to improve your focus skills.</li>
      </ul>
      <p className="text-sm text-muted-foreground mt-4">
        Your Focus Buddy reacts to your score: a happy face when you do well, and a sad face if you miss too many distractions.
      </p>

      <div className="mt-6 text-center">
        <p className="font-medium mb-2">Your Focus Buddy says:</p>
        <div className="text-6xl">
          {score >= 150 ? "🤩" : score >= 70 ? "🙂" : "😢"}
        </div>
      </div>
    </div>

  </div>
);

}
