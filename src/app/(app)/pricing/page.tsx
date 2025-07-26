import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Start with a free trial, and then pick the plan that’s right for your family to unlock all of our awesome features.
        </p>
      </div>
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg transform hover:scale-105 transition-transform duration-300">
          <CardHeader>
            <CardTitle>Individual Plan</CardTitle>
            <CardDescription>Perfect for one child ready to become a time management pro.</CardDescription>
            <div className="text-5xl font-bold pt-4">$12.50<span className="text-xl font-normal text-muted-foreground">/one-time</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="grid gap-3 text-left text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent" /> Full access for <strong>one child</strong></li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent" /> All interactive lessons</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent" /> AI planner tools</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-accent" /> Calendar and To-Do lists</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/signup?plan=individual">Choose Plan</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="border-primary border-2 shadow-xl transform hover:scale-105 transition-transform duration-300 relative">
          <div className="absolute top-0 right-4 -mt-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">Most Popular</div>
          <CardHeader>
            <CardTitle>Family Plan</CardTitle>
            <CardDescription>Get the whole family organized and on track.</CardDescription>
            <div className="text-5xl font-bold pt-4">$17.50<span className="text-xl font-normal text-muted-foreground">/one-time</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="grid gap-3 text-left text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Full access for up to <strong>two children</strong></li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> All features from Individual Plan</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Separate profiles for each child</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Family progress tracking <span className="text-xs font-bold text-primary/80">(coming soon!)</span></li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
                <Link href="/signup?plan=family">Choose Family Plan</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
