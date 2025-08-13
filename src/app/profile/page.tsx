
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
import { SubscriptionManager } from "@/components/subscription-manager"

export const dynamic = "force-dynamic";

type ProfileFormData = {
    fullName: string;
    age: string;
    gender: string;
    country: string;
    useCase: string;
    avatarUrl: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    industry: string;
    experienceLevel: string;
    preferences: {
        theme: string;
        notifications: boolean;
        newsletter: boolean;
        language: string;
    };
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
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      industry: '',
      experienceLevel: '',
      preferences: {
          theme: '',
          notifications: false,
          newsletter: false,
          language: '',
      },
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
              email: userData.email || '',
              phone: userData.phone || '',
              company: userData.company || '',
              jobTitle: userData.job_title || '',
              industry: userData.industry || '',
              experienceLevel: userData.experience_level || '',
              preferences: {
                  theme: userData.preferences?.theme || '',
                  notifications: userData.preferences?.notifications || false,
                  newsletter: userData.preferences?.newsletter || false,
                  language: userData.preferences?.language || '',
              },
          });
      } else if (user) {
           setProfileData(prev => ({ ...prev, fullName: user.user_metadata.full_name || user.email || '' }));
      }
  }, [userData, user]);
  
  const handleInputChange = (field: keyof typeof profileData, value: string | typeof profileData.preferences) => {
    if (field === 'preferences' && typeof value === 'object') {
      setProfileData(prev => ({...prev, preferences: value as typeof profileData.preferences}));
    } else {
      setProfileData(prev => ({...prev, [field]: value as string}));
    }
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
              email: profileData.email,
              phone: profileData.phone,
              company: profileData.company,
              job_title: profileData.jobTitle,
              industry: profileData.industry,
              experience_level: profileData.experienceLevel,
              preferences: {
                  theme: profileData.preferences.theme,
                  notifications: profileData.preferences.notifications,
                  newsletter: profileData.preferences.newsletter,
                  language: profileData.preferences.language,
              },
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <form onSubmit={handleSaveChanges} className="space-y-8">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a profile picture to personalize your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatarUrl} alt="Profile" />
                    <AvatarFallback>{profileData.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                    <Button asChild variant="outline" disabled={isUploading}>
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        {isUploading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                      </label>
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your personal and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profileData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Your work and professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={profileData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="Enter your job title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={profileData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Select value={profileData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (6-10 years)</SelectItem>
                        <SelectItem value="expert">Expert (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={profileData.preferences.theme} 
                      onValueChange={(value) => setProfileData(prev => ({
                        ...prev, 
                        preferences: { ...prev.preferences, theme: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={profileData.preferences.language} 
                      onValueChange={(value) => setProfileData(prev => ({
                        ...prev, 
                        preferences: { ...prev.preferences, language: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </form>

          {/* Subscription Management */}
          <div className="mt-8">
            <SubscriptionManager />
          </div>
        </div>
      </div>
    </div>
  );
}

    