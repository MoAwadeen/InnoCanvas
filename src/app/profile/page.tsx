
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
import { Bot, LogOut, User, Loader } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { countries } from "@/lib/countries"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { auth, db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { signOut, updateProfile as updateAuthProfile } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

export default function ProfilePage() {
    const { user, userData, loading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState({
        fullName: '',
        age: '',
        gender: '',
        country: '',
        useCase: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (userData) {
            setProfileData({
                fullName: userData.fullName || user?.displayName || '',
                age: userData.age || '',
                gender: userData.gender || '',
                country: userData.country || '',
                useCase: userData.useCase || '',
            });
        } else if (user) {
             setProfileData(prev => ({ ...prev, fullName: user.displayName || '' }));
        }
    }, [userData, user]);
    
    const handleInputChange = (field: keyof typeof profileData, value: string) => {
        setProfileData(prev => ({...prev, [field]: value}))
    }

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                fullName: profileData.fullName,
                age: profileData.age,
                gender: profileData.gender,
                country: profileData.country,
                useCase: profileData.useCase
            });
            
            if (auth.currentUser && auth.currentUser.displayName !== profileData.fullName) {
                await updateAuthProfile(auth.currentUser, { displayName: profileData.fullName });
            }

            toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved successfully.',
            });

        } catch(error: any) {
            toast({
                title: 'Update Failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogout = async () => {
        try {
        await signOut(auth);
        toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
        });
        router.push('/login');
        } catch (error) {
        toast({
            title: 'Logout Failed',
            description: 'There was an error logging you out.',
            variant: 'destructive',
        });
        }
    };
    
    if (authLoading || (!user && !authLoading)) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <Loader className="w-16 h-16 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
        router.push('/login');
        return null;
    }
    
    const displayName = profileData.fullName || user.displayName || 'Innovator';
    const displayInitial = (profileData.fullName || user.displayName || 'I').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-5xl flex justify-between items-center mb-8">
            <Link href="/my-canvases" className="flex items-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                <span className="font-bold text-2xl">InnoCanvas</span>
            </Link>
            <div className="flex items-center gap-4">
                <Link href="/my-canvases">
                    <Button variant="secondary">My Canvases</Button>
                </Link>
                 <Button variant="secondary" onClick={handleLogout}><LogOut className="mr-2"/>Logout</Button>
            </div>
      </header>
      <main className="w-full max-w-5xl flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Your Profile</h1>
        <Card className="mx-auto max-w-3xl w-full border-border bg-card">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-2 border-primary">
                        <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png/000987/FFFFFF?text=${displayInitial}`} alt={displayName} />
                        <AvatarFallback>{displayInitial}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl text-card-foreground">{displayName}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSaveChanges}>
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name" className="text-card-foreground">Full Name</Label>
                            <Input id="full-name" value={profileData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="email" className="text-card-foreground">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="text-muted-foreground"
                        />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="age" className="text-card-foreground">Age</Label>
                            <Input id="age" type="number" placeholder="25" value={profileData.age} onChange={(e) => handleInputChange('age', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gender" className="text-card-foreground">Gender</Label>
                            <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
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
                        <Label htmlFor="country" className="text-card-foreground">Country</Label>
                        <Select value={profileData.country} onValueChange={(value) => handleInputChange('country', value)}>
                            <SelectTrigger id="country">
                                <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent>
                                <ScrollArea className="h-72">
                                {countries.map((country) => (
                                    <SelectItem key={country.code} value={country.name}>
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
                        <Label htmlFor="use-case" className="text-card-foreground">Primary Use Case</Label>
                        <Select value={profileData.useCase} onValueChange={(value) => handleInputChange('useCase', value)}>
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
                    
                    <Button variant="gradient" type="submit" className="w-full mt-2" disabled={isLoading}>
                      {isLoading ? <Loader className="animate-spin"/> : 'Save Changes'}
                    </Button>
                </div>
            </form>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
