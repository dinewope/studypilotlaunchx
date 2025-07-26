import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, Clock, BookOpenCheck, BrainCircuit, Calendar, Check, ClipboardList, Gem, GanttChart, Target, LayoutGrid, BellOff, Users } from 'lucide-react';
import Logo from '@/components/logo';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: <BookOpenCheck className="h-10 w-10 text-primary-foreground" />,
      title: 'Interactive Lessons',
      description: 'Fun simulations on prioritization, goal setting, scheduling, and more to build strong habits.',
      bgColor: 'bg-primary'
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-accent-foreground" />,
      title: 'AI Planners',
      description: 'Our smart helpers teach kids how to plan their week and study for tests effectively.',
      bgColor: 'bg-accent'
    },
    {
      icon: <Calendar className="h-10 w-10 text-secondary-foreground" />,
      title: 'Calendar & To-Do Lists',
      description: 'Simple tools to help kids organize their tasks, activities, and assignments all in one place.',
      bgColor: 'bg-secondary'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Logo />
          <span className="sr-only">Studypilot</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col items-start gap-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-left">
                  Unlock Your Child's Potential with <span className="text-primary-foreground bg-primary px-2 rounded-md">Studypilot</span>
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl text-left">
                  We teach essential time management skills to young students through fun, interactive lessons and AI-powered tools, setting them up for a stress-free, successful future.
                </p>
                 <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Button asChild size="lg">
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                </div>
              </div>
               <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover w-[600px] h-[400px] bg-secondary flex items-center justify-center">
                <Image  src="/images/studypilot logo.jpeg" alt="Boy studying" layout="fill" objectFit="cover" data-ai-hint="child studying"/>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Skills for Life, Made Fun</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is packed with features designed to be engaging and educational, helping kids master time management without the boredom.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-1 text-center">
                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${feature.bgColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Affordable Plans for Every Family</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started for free, then choose a plan that fits your needs.
              </p>
            </div>
            <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Individual Plan</CardTitle>
                  <CardDescription>Perfect for one child ready to become a time management pro.</CardDescription>
                  <div className="text-4xl font-bold pt-4">$12.50<span className="text-lg font-normal text-muted-foreground">/one-time</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="grid gap-2 text-left">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent" /> Full access for one child</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent" /> All interactive lessons</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent" /> AI planner tools</li>
                  </ul>
                </CardContent>
                <CardFooter>
                   <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/signup?plan=individual">Choose Plan</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-primary border-2 shadow-xl relative">
                <div className="absolute top-0 right-4 -mt-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">Most Popular</div>
                <CardHeader>
                  <CardTitle>Family Plan</CardTitle>
                  <CardDescription>Get the whole family organized and on track.</CardDescription>
                  <div className="text-4xl font-bold pt-4">$17.50<span className="text-lg font-normal text-muted-foreground">/one-time</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="grid gap-2 text-left">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Full access for up to <strong>two children</strong></li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> All features from Individual Plan</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Family progress tracking (coming soon!)</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/signup?plan=family">Choose Plan</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Studypilot. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
