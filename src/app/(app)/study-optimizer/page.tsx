import { StudyOptimizerForm } from './form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StudyOptimizerPage() {
  return (
    <div className="space-y-8 px-4 md:px-0 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Study Optimizer</h1>
        <p className="text-muted-foreground max-w-xl">
          Don't know where to start studying? Tell us about your test, and we'll create a smart study plan for you!
        </p>
      </div>

      {/* Grid for form + image */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left side: form */}
        <Card className="md:col-span-2 w-full max-w-3xl mx-auto p-8">
          <CardHeader>
            <CardTitle>Create a Study Plan</CardTitle>
            <CardDescription>
              Fill in the details below to get your personalized schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudyOptimizerForm />
          </CardContent>
        </Card>

        {/* Right side: image and motivation */}
        <div className="hidden md:flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6 max-w-sm mx-auto">
          <img
            src="https://i.postimg.cc/ZqRCZY0y/2025-07-26-211625.png"
            alt="Wishing you a productive day ahead!"
            className="rounded-lg shadow-lg mb-4 max-w-xs h-auto"
          />
          <p className="text-center text-sm text-muted-foreground">
            📚 Wishing you a productive day ahead!  
            Let's make studying smarter and easier.
          </p>
        </div>
      </div>
    </div>
  )
}