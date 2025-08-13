'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Calendar, 
  Crown, 
  Star, 
  Zap, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionData {
  id: number;
  status: string;
  status_formatted: string;
  card_brand: string;
  card_last_four: string;
  renews_at: string | null;
  ends_at: string | null;
  cancelled: boolean;
  product_name: string;
  variant_name: string;
}

export function SubscriptionManager() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (userData?.subscription_id) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [userData]);

  const fetchSubscription = async () => {
    if (!userData?.subscription_id) return;

    try {
      const response = await fetch(`/api/lemonsqueezy/subscription/${userData.subscription_id}`);
      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
      } else {
        console.error('Failed to fetch subscription:', data.error);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userData?.subscription_id) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/lemonsqueezy/subscription/${userData.subscription_id}/cancel`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription will end at the current billing period.",
        });
        fetchSubscription(); // Refresh data
      } else {
        throw new Error(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (!userData?.subscription_id) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/lemonsqueezy/subscription/${userData.subscription_id}/resume`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Subscription Resumed",
          description: "Your subscription has been reactivated.",
        });
        fetchSubscription(); // Refresh data
      } else {
        throw new Error(data.error || 'Failed to resume subscription');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resume subscription",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'pro':
        return <Star className="w-5 h-5 text-blue-500" />;
      default:
        return <Zap className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string, cancelled: boolean) => {
    if (cancelled) return <XCircle className="w-4 h-4 text-red-500" />;
    if (status === 'active') return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading subscription details...</span>
        </CardContent>
      </Card>
    );
  }

  if (!userData?.subscription_id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription>
            You don't have an active subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Upgrade to Pro or Premium to unlock advanced features.
            </p>
            <Button asChild>
              <a href="/payment">Upgrade Now</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-muted-foreground">Unable to load subscription details.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription Details
        </CardTitle>
        <CardDescription>
          Manage your InnoCanvas subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getPlanIcon(userData.plan)}
            <div>
              <h3 className="font-semibold capitalize">{userData.plan} Plan</h3>
              <p className="text-sm text-muted-foreground">{subscription.product_name}</p>
            </div>
          </div>
          <Badge 
            variant={subscription.cancelled ? "destructive" : "default"}
            className="flex items-center gap-1"
          >
            {getStatusIcon(subscription.status, subscription.cancelled)}
            {subscription.status_formatted}
          </Badge>
        </div>

        <Separator />

        {/* Payment Method */}
        <div>
          <h4 className="font-medium mb-2">Payment Method</h4>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4" />
            <span>
              {subscription.card_brand} •••• {subscription.card_last_four}
            </span>
          </div>
        </div>

        {/* Billing Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Next Billing</h4>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(subscription.renews_at)}</span>
            </div>
          </div>
          {subscription.ends_at && (
            <div>
              <h4 className="font-medium mb-2">Ends On</h4>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(subscription.ends_at)}</span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {subscription.cancelled ? (
            <Button 
              onClick={handleResumeSubscription}
              disabled={actionLoading}
              variant="outline"
              className="flex-1"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Resuming...
                </>
              ) : (
                'Resume Subscription'
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleCancelSubscription}
              disabled={actionLoading}
              variant="destructive"
              className="flex-1"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          )}
          
          <Button asChild variant="outline">
            <a href="/payment">Change Plan</a>
          </Button>
        </div>

        {/* Info */}
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">
            {subscription.cancelled 
              ? "Your subscription will end at the current billing period. You can resume it anytime before the end date."
              : "You can cancel your subscription anytime. You'll continue to have access until the end of your current billing period."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
