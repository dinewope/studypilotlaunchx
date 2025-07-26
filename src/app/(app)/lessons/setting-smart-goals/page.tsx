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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lightbulb,
  Target,
  Calendar,
  Check,
  Scale,
  ThumbsUp,
  PartyPopper,
  Loader2,
  Coins,
} from 'lucide-react';
import Link from 'next/link';
import { generateSmartGoalExamples } from '@/ai/flows/smart-goal-generator';
import { useCoins } from '@/context/CoinContext';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Lesson Tips card to make SMART goal setting more fun and effective
function LessonTipsCard() {
  return (
    <Card className="w-full border-indigo-400 bg-indigo-50">
      <CardHeader>
        <CardTitle>💡 Pro Tips</CardTitle>
        <CardDescription>Boost your SMART goals!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ul className="list-disc list-inside text-sm">
          <li>📝 Break big goals into mini-challenges each day.</li>
          <li>📅 Review your progress at the same time every day.</li>
          <li>🏆 Reward yourself when you hit each SMART milestone.</li>
          <li>👫 Share your plan with a friend or family member.</li>
          <li>🎨 Make your goal visual: draw or use sticky notes.</li>
        </ul>
      </CardContent>
    </Card>
  );
}

type StepId = 'intro' | 'S' | 'M' | 'A' | 'R' | 'T' | 'summary';

interface Step {
  id: StepId;
  title: string;
  question: string;
  icon: React.FC<any>;
  description: string;
}

const staticSteps: Step[] = [
  { id: 'intro', title: 'Your Big Goal', question: 'What is a big goal you want to achieve?', icon: Target, description: 'Let\'s start with your main mission! What do you want to accomplish?' },
  { id: 'S', title: 'Specific', question: 'How can you make your goal clear and specific?', icon: Lightbulb, description: 'Be precise: what exactly will you do?' },
  { id: 'M', title: 'Measurable', question: 'How will you measure your success?', icon: Scale, description: 'Choose numbers or milestones to track.' },
  { id: 'A', title: 'Achievable', question: 'Is this goal realistic right now?', icon: ThumbsUp, description: 'Check if you have the tools and time.' },
  { id: 'R', title: 'Relevant', question: 'Why is this goal important to you?', icon: Check, description: 'Connect it to what matters most.' },
  { id: 'T', title: 'Time-Bound', question: 'What is your deadline?', icon: Calendar, description: 'Set a clear finish line.' },
];

const defaultPlaceholders: Record<StepId, string> = {
  intro: 'e.g., Learn basic coding by building a simple game',
  S: 'e.g., I will build a small JavaScript game that responds to clicks',
  M: 'e.g., I will complete one coding lesson per day for 10 days',
  A: 'e.g., I can spend 30 minutes after school and have access to tutorials',
  R: 'e.g., It helps me improve problem-solving and creativity',
  T: 'e.g., I will finish by the end of this month',
  summary: '',
};

export default function SettingSmartGoalsPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<StepId, string>>({ intro: '', S: '', M: '', A: '', R: '', T: '', summary: '' });
  const [placeholders, setPlaceholders] = useState(defaultPlaceholders);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addCoins } = useCoins();
  const [coinsAwarded, setCoinsAwarded] = useState(false);
  const { width, height } = useWindowSize();

  const currentStep = staticSteps[currentStepIndex];
  const progress = (currentStepIndex / staticSteps.length) * 100;
  const isSummary = currentStepIndex === staticSteps.length;

  const handleNext = async () => {
    if (currentStep.id === 'intro' && answers.intro) {
      setIsGenerating(true);
      try {
        const result = await generateSmartGoalExamples({ goal: answers.intro });
        setPlaceholders({
          ...defaultPlaceholders,
          S: `e.g., ${result.specific}`,
          M: `e.g., ${result.measurable}`,
          A: `e.g., ${result.achievable}`,
          R: `e.g., ${result.relevant}`,
          T: `e.g., ${result.timeBound}`,
        });
      } catch {
        setPlaceholders(defaultPlaceholders);
      } finally {
        setIsGenerating(false);
      }
    }

    if (currentStepIndex < staticSteps.length) {
      setCurrentStepIndex(i => i + 1);
    }
  };

  useEffect(() => {
    if (isSummary && !coinsAwarded) {
      addCoins(50);
      setCoinsAwarded(true);
    }
  }, [isSummary, coinsAwarded, addCoins]);

  const handleBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(i => i - 1);
  };

  const handleReset = () => {
    setAnswers({ intro: '', S: '', M: '', A: '', R: '', T: '', summary: '' });
    setPlaceholders(defaultPlaceholders);
    setCurrentStepIndex(0);
    setCoinsAwarded(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [currentStep.id]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      <header className="flex items-center mb-6">
        <Button asChild variant="outline" size="icon">
          <Link href="/lessons"><ArrowLeft /></Link>
        </Button>
        <div className="ml-4">
          <h1 className="text-4xl font-bold">SMART Goal Builder</h1>
          <p className="text-gray-600">Craft clear goals in full-page view!</p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="flex flex-col">
          <Card className="flex flex-col flex-1">
            <CardHeader>
              <Progress value={isSummary ? 100 : progress} className="mb-4" />
              <AnimatePresence mode="wait">
                {!isSummary && (
                  <motion.div key={currentStep.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 rounded-full"><currentStep.icon className="h-6 w-6 text-indigo-600"/></div>
                      <div>
                        <CardTitle className="text-xl">{currentStep.title}</CardTitle>
                        <CardDescription>{currentStep.question}</CardDescription>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isSummary ? (
                  <motion.div key={currentStep.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
                    {isGenerating ? (
                      <Loader2 className="mx-auto animate-spin text-indigo-600" />
                    ) : (
                      <Textarea
                        id={currentStep.id}
                        rows={5}
                        value={answers[currentStep.id]}
                        onChange={handleInputChange}
                        placeholder={placeholders[currentStep.id]}
                        className="w-full"
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="summary" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                    <PartyPopper className="mx-auto h-20 w-20 text-indigo-600" />
                    <h2 className="text-3xl font-bold">Congratulations!</h2>
                    <p className="text-gray-700">You've built a powerful SMART goal. Here it is:</p>
                    <Card className="bg-indigo-50 mt-4">
                      <CardContent className="p-6 text-left space-y-2">
                        <p><strong>Goal:</strong> {answers.intro}</p>
                        <p><strong>Specific:</strong> {answers.S}</p>
                        <p><strong>Measurable:</strong> {answers.M}</p>
                        <p><strong>Achievable:</strong> {answers.A}</p>
                        <p><strong>Relevant:</strong> {answers.R}</p>
                        <p><strong>Time-bound:</strong> {answers.T}</p>
                      </CardContent>
                    </Card>
                    <div className="flex items-center justify-center gap-3 mt-4 text-xl font-semibold text-indigo-600">
                      <Coins className="h-6 w-6"/>
                      <span>+50 Coins!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={currentStepIndex === 0 || isGenerating}>Back</Button>
              {!isSummary ? (
                <Button onClick={handleNext} disabled={!answers[currentStep.id].trim() || isGenerating}>
                  {isGenerating ? 'Thinking...' : currentStepIndex === staticSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              ) : (
                <Button onClick={handleReset}>Build Another Goal</Button>
              )}
            </CardFooter>
          </Card>
        </section>

        <aside className="flex flex-col">
          <LessonTipsCard />
        </aside>
      </main>
    </div>
  );
}