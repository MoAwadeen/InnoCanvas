
'use client';

import Link from "next/link"
import { unstable_noStore as noStore } from 'next/cache';
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
import { LogOut, Loader, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { countries } from "@/lib/countries"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth, UserProfile } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { getPublicUrl, supabase } from "@/lib/supabase"

type ProfileFormData = {
    fullName: string;
    age: string;
    gender: string;
    country: string;
    useCase: string;
    avatarUrl: string;
};

export default function ProfilePage() {
    // Force dynamic rendering to avoid SSR issues
    noStore();
    
    const { user, userData, loading: authLoading, fetchUserProfile } = useAuth();
    const [profileData, setProfileData] = useState<ProfileFormData>({
        fullName: '',
        age: '',
        gender: '',
        country: '',
        useCase: '',
        avatarUrl: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (userData) {
            setProfileData({
                fullName: userData.full_name || '',
                age: userData.age?.toString() || '',
                gender: userData.gender || '',
                country: userData.country || '',
                useCase: userData.use_case || '',
                avatarUrl: userData.avatar_url && userData.avatar_url.trim() ? getPublicUrl('avatars', userData.avatar_url) || '' : '',
            });
        } else if (user) {
             setProfileData(prev => ({ ...prev, fullName: user.user_metadata.full_name || user.email || '' }));
        }
    }, [userData, user]);
    
    const handleInputChange = (field: keyof typeof profileData, value: string) => {
        setProfileData(prev => ({...prev, [field]: value}))
    }

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({ title: "File too large", description: "Image should be less than 2MB.", variant: "destructive"});
                return;
            }
            
            setIsUploading(true);
            try {
                // To ensure uniqueness and prevent overwriting, we can use the user's ID
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file, { upsert: true });

                if (uploadError) throw uploadError;

                // Update the profile with the new avatar path
                 const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ avatar_url: filePath, updated_at: new Date().toISOString() })
                    .eq('id', user.id);

                if (updateError) throw updateError;
                
                // Refresh user data to get new avatar URL
                await fetchUserProfile();

                toast({ title: 'Avatar updated!' });
            } catch (error: any) {
                toast({ title: "Upload failed", description: error.message, variant: "destructive"});
            } finally {
                setIsUploading(false);
            }
        }
    };


    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        try {
            const updates: Partial<UserProfile> = {
                id: user.id,
                full_name: profileData.fullName,
                age: parseInt(profileData.age, 10) || null,
                gender: profileData.gender,
                country: profileData.country,
                use_case: profileData.useCase,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            
            if (error) throw error;
            
            const { data, error: userUpdateError } = await supabase.auth.updateUser({
                data: { full_name: profileData.fullName }
            })

            if (userUpdateError) throw userUpdateError;

            toast({
                title: 'Profile Updated',
                description: 'Your changes have been saved successfully.',
            });
            
            // Re-fetch user data to update the UI, especially the name in the header
            if (data.user) {
                await fetchUserProfile();
            }
            
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
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
            });
            router.push('/login');
        } catch (error: any) {
            toast({
                title: 'Logout Failed',
                description: 'There was an error logging you out.',
                variant: 'destructive',
            });
        }
    };
    
    useEffect(() => {
        if (!authLoading && !user) {
          router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <Loader className="w-16 h-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const displayName = profileData.fullName || user.email || 'Innovator';
    const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-5xl flex justify-between items-center mb-8">
            <Logo href="/my-canvases" />
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
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Avatar className="w-24 h-24 border-2 border-primary">
                            <AvatarImage src={profileData.avatarUrl} alt={displayName} />
                            <AvatarFallback>{displayInitial}</AvatarFallback>
                        </Avatar>
                        <input type="file" id="avatar-upload" className="hidden" accept="image/png, image/jpeg" onChange={handleAvatarUpload} disabled={isUploading} />
                        <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8" asChild>
                           <label htmlFor="avatar-upload" className="cursor-pointer">
                             {isUploading ? <Loader className="animate-spin" /> : <Upload />}
                           </label>
                        </Button>
                    </div>
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

    