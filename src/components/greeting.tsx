'use client';

import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Coffee, Sparkles } from 'lucide-react';

export function Greeting() {
  const { userData } = useAuth();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good morning', icon: <Sun className="h-4 w-4" />, color: 'text-yellow-600' };
    if (hour < 17) return { greeting: 'Good afternoon', icon: <Coffee className="h-4 w-4" />, color: 'text-orange-600' };
    return { greeting: 'Good evening', icon: <Moon className="h-4 w-4" />, color: 'text-blue-600' };
  };

  const getDisplayName = () => {
    if (!userData) return 'there';
    
    const name = userData.full_name || 'there';
    return name.split(' ')[0]; // Return first name only
  };

  const getUseCaseBadge = () => {
    if (!userData?.use_case) return null;
    
    const useCaseMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      student: { label: 'Student', variant: 'default' },
      entrepreneur: { label: 'Entrepreneur', variant: 'secondary' },
      accelerator: { label: 'Accelerator', variant: 'outline' },
      consultant: { label: 'Consultant', variant: 'default' },
      other: { label: 'Business User', variant: 'outline' },
    };

    const config = useCaseMap[userData.use_case] || useCaseMap.other;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const timeOfDay = getTimeOfDay();
  const displayName = getDisplayName();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData?.avatar_url || ''} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`${timeOfDay.color}`}>
                  {timeOfDay.icon}
                </span>
                <h2 className="text-xl font-semibold text-gray-900">
                  {timeOfDay.greeting}, {displayName}!
                </h2>
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
              
              <p className="text-sm text-gray-600">
                Ready to create your next Business Model Canvas?
              </p>
              
              {getUseCaseBadge() && (
                <div className="flex items-center space-x-2">
                  {getUseCaseBadge()}
                  <span className="text-xs text-gray-500">
                    • {userData?.country || 'Unknown'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-xs text-gray-400">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 