'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { PlanService, PlanLimits } from '@/lib/plan-service';
import { Crown, Zap, Star, Check, X } from 'lucide-react';

interface PlanLimitsProps {
  onUpgrade?: () => void;
}

export function PlanLimitsDisplay({ onUpgrade }: PlanLimitsProps) {
  const { userData, checkPlanLimit, getPlanLimits } = useAuth();
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanLimits = async () => {
      if (userData?.plan) {
        const limits = await getPlanLimits();
        setPlanLimits(limits);
      }
      setLoading(false);
    };

    fetchPlanLimits();
  }, [userData?.plan, getPlanLimits]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!planLimits) {
    return null;
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'pro':
        return <Zap className="w-5 h-5 text-blue-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'pro':
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const features = [
    {
      name: 'Canvas Creation',
      value: planLimits.max_canvases === -1 ? 'Unlimited' : `${planLimits.max_canvases} canvases`,
      available: true
    },
    {
      name: 'PDF Download',
      value: planLimits.pdf_download ? 'Available' : 'Not available',
      available: planLimits.pdf_download
    },
    {
      name: 'Color Customization',
      value: planLimits.color_customization ? 'Available' : 'Not available',
      available: planLimits.color_customization
    },
    {
      name: 'AI Consultant',
      value: planLimits.ai_consultant ? 'Available' : 'Not available',
      available: planLimits.ai_consultant
    },
    {
      name: 'Templates Access',
      value: planLimits.templates_access ? 'Available' : 'Not available',
      available: planLimits.templates_access
    },
    {
      name: 'Remove Watermark',
      value: planLimits.remove_watermark ? 'Available' : 'Not available',
      available: planLimits.remove_watermark
    },
    {
      name: 'Priority Support',
      value: planLimits.priority_support ? 'Available' : 'Not available',
      available: planLimits.priority_support
    },
    {
      name: 'API Access',
      value: planLimits.api_access ? 'Available' : 'Not available',
      available: planLimits.api_access
    },
    {
      name: 'Team Collaboration',
      value: planLimits.team_collaboration ? 'Available' : 'Not available',
      available: planLimits.team_collaboration
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getPlanIcon(userData?.plan || 'free')}
            {userData?.plan?.toUpperCase()} Plan
          </CardTitle>
          <Badge className={getPlanColor(userData?.plan || 'free')}>
            {userData?.plan === 'premium' ? 'Premium' : userData?.plan === 'pro' ? 'Pro' : 'Free'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex items-center justify-between">
              <span className="text-sm font-medium">{feature.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${feature.available ? 'text-green-600' : 'text-gray-500'}`}>
                  {feature.value}
                </span>
                {feature.available ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {userData?.plan === 'free' && onUpgrade && (
          <div className="mt-6 pt-4 border-t">
            <Button onClick={onUpgrade} className="w-full">
              Upgrade to Pro
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PlanLimitAlert({ action, onUpgrade }: { action: string; onUpgrade?: () => void }) {
  const { userData } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkLimit = async () => {
      // This would be called when a user tries to perform an action
      // For now, we'll just show the alert based on the action
      if (action === 'create_canvas' && userData?.plan === 'free') {
        setShowAlert(true);
      }
    };

    checkLimit();
  }, [action, userData?.plan]);

  if (!showAlert) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Plan Limit Reached
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-yellow-700 mb-4">
          You've reached the limit for your {userData?.plan} plan. Upgrade to unlock more features and higher limits.
        </p>
        {onUpgrade && (
          <Button onClick={onUpgrade} className="bg-yellow-600 hover:bg-yellow-700">
            Upgrade Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
