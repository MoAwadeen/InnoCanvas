
'use client';

import Link from "next/link"
import ReactCountryFlag from "react-country-flag"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bot } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { countries } from "@/lib/countries"

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-primary/30 text-white flex flex-col items-center justify-center p-4 md:p-8">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">InnoCanvas</span>
          </Link>
        </div>
      <Card className="mx-auto max-w-sm w-full bg-card/50 backdrop-blur-lg border-border/20 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account. Start your journey with AI-driven strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Max Robinson" required className="bg-background/50 border-border/30" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-background/50 border-border/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" placeholder="25" required className="bg-background/50 border-border/30" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                        <SelectTrigger id="gender" className="bg-background/50 border-border/30">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                 <Select>
                    <SelectTrigger id="country" className="bg-background/50 border-border/30">
                        <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                        <ScrollArea className="h-72">
                        {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                    <ReactCountryFlag countryCode={country.code} svg />
                                    <span>{country.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                        </ScrollArea>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="use-case">Primary Use Case</Label>
                <Select>
                    <SelectTrigger id="use-case" className="bg-background/50 border-border/30">
                        <SelectValue placeholder="How will you use InnoCanvas?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                        <SelectItem value="accelerator">Accelerator</SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="bg-background/50 border-border/30" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
              Create an account
            </Button>
            <Button variant="outline" className="w-full bg-transparent hover:bg-white/10 border-border/30 hover:text-white">
              Sign up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
    