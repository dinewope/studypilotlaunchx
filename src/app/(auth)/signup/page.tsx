
'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CreditCard } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignupPage() {
    const searchParams = useSearchParams()
    const initialPlan = searchParams.get('plan') || 'individual'
    const [selectedPlan, setSelectedPlan] = React.useState(initialPlan);
    const [paymentCompleted, setPaymentCompleted] = React.useState(false);

    const paymentLink = selectedPlan === 'individual' 
        ? 'https://buy.stripe.com/6oU6oG0D19PNaTncRl5AR1p' 
        : 'https://buy.stripe.com/5kQ6oG1H5bXVgdH7x15AR1h';

    return (
        <div className="w-full max-w-2xl">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Start your journey to better time management today!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Account Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Your Child's Name</Label>
                                <Input id="name" placeholder="Alex Johnson" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" />
                        </div>
                    </div>

                    {/* Plan Selection */}
                    <div className="space-y-4">
                        <Label>Choose Your Plan</Label>
                         <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="individual" id="individual" className="peer sr-only" />
                                <Label htmlFor="individual" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                
                                    <p className="text-2xl font-bold">$12.50</p>
                                    <p className="text-sm text-muted-foreground">3 months</p>
                                </Label>
                            </div>
                             <div>
                                <RadioGroupItem value="family" id="family" className="peer sr-only" />
                                <Label htmlFor="family" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                 
                                    <p className="text-2xl font-bold">$17.50</p>
                                    <p className="text-sm text-muted-foreground">5 months</p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                     {/* Payment Info */}
                    <div className="space-y-4">
                        <Label>Payment</Label>
                         <div className="space-y-2">
                            <Button asChild variant="outline" className="w-full justify-start text-left font-normal">
                                <Link href={paymentLink} target="_blank">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Continue to Payment
                                </Link>
                            </Button>
                             <p className="text-xs text-muted-foreground">You will be redirected to our secure payment processor. Come back to this page after you're done!</p>
                        </div>
                    </div>

                    {/* Confirmation */}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="payment-confirmation" checked={paymentCompleted} onCheckedChange={(checked) => setPaymentCompleted(checked as boolean)} />
                        <label
                            htmlFor="payment-confirmation"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I have successfully completed payment.
                        </label>
                    </div>

                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button asChild={paymentCompleted} className="w-full" disabled={!paymentCompleted}>
                        {paymentCompleted ? (
                            <Link href="/dashboard">Create Account & Start Learning</Link>
                        ) : (
                            <span>Create Account & Start Learning</span>
                        )}
                    </Button>
                     <p className="text-xs text-muted-foreground">
                        Already have an account? <Link href="/dashboard" className="underline">Log in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
} 
