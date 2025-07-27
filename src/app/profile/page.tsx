
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
import { Bot, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { countries } from "@/lib/countries"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-5xl flex justify-between items-center mb-8">
            <Link href="/my-canvases" className="flex items-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                <span className="font-bold text-2xl">InnoCanvas</span>
            </Link>
            <div className="flex items-center gap-4">
                <Link href="/my-canvases">
                    <Button variant="outline">My Canvases</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Logout</Button>
                </Link>
            </div>
      </header>
      <main className="w-full max-w-5xl flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Your Profile</h1>
        <Card className="mx-auto max-w-3xl w-full">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-2 border-primary">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Mohamed Awadeen" data-ai-hint="man portrait"/>
                        <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">Mohamed Awadeen</CardTitle>
                        <CardDescription>mohamed.awadeen@example.com</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
            <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" defaultValue="Mohamed Awadeen" required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        defaultValue="mohamed.awadeen@example.com"
                        required
                        disabled
                    />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" placeholder="25" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select>
                            <SelectTrigger id="gender">
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
                        <SelectTrigger id="country">
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
                        <SelectTrigger id="use-case">
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
                
                <Button type="submit" className="w-full">
                Save Changes
                </Button>
            </div>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
