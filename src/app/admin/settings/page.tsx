'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Settings, 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  Shield, 
  Database, 
  CreditCard,
  Users,
  FileText,
  Bell,
  Globe,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxFreeCanvases: number;
  maxProCanvases: number;
  maxPremiumCanvases: number;
  aiModel: string;
  defaultLanguage: string;
  timezone: string;
}

interface SystemStatus {
  database: 'online' | 'offline';
  aiService: 'online' | 'offline';
  paymentGateway: 'online' | 'offline';
  storage: 'online' | 'offline';
  lastChecked: string;
}

export default function AdminSettingsPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFreeCanvases: 3,
    maxProCanvases: 10,
    maxPremiumCanvases: 999,
    aiModel: 'gpt-4o-mini',
    defaultLanguage: 'en',
    timezone: 'UTC'
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'online',
    aiService: 'online',
    paymentGateway: 'online',
    storage: 'online',
    lastChecked: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  useEffect(() => {
    if (userData && userData.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      router.push('/');
      return;
    }

    if (userData?.role === 'admin') {
      fetchSettings();
      checkSystemStatus();
    }
  }, [userData, router, toast]);

  const fetchSettings = async () => {
    try {
      // In a real application, you would fetch settings from your database
      // For now, we'll use the default settings
      console.log('Fetching system settings...');
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load system settings.",
        variant: "destructive"
      });
    }
  };

  const checkSystemStatus = async () => {
    try {
      // Check database connection
      const { error: dbError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      
      // Check AI service (mock)
      const aiStatus = 'online'; // In real app, test OpenAI API
      
      // Check payment gateway (mock)
      const paymentStatus = 'online'; // In real app, test LemonSqueezy API
      
      // Check storage (mock)
      const storageStatus = 'online'; // In real app, test Supabase Storage

      setSystemStatus({
        database: dbError ? 'offline' : 'online',
        aiService: aiStatus,
        paymentGateway: paymentStatus,
        storage: storageStatus,
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error checking system status:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      
      // In a real application, you would save settings to your database
      // For now, we'll just simulate the save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "System settings saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save system settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenanceMode = async () => {
    if (settings.maintenanceMode) {
      // Turning off maintenance mode
      setSettings(prev => ({ ...prev, maintenanceMode: false }));
      toast({
        title: "Maintenance Mode Disabled",
        description: "The platform is now accessible to all users.",
      });
    } else {
      // Turning on maintenance mode
      setShowMaintenanceDialog(true);
    }
  };

  const enableMaintenanceMode = () => {
    setSettings(prev => ({ ...prev, maintenanceMode: true }));
    setShowMaintenanceDialog(false);
    toast({
      title: "Maintenance Mode Enabled",
      description: "The platform is now in maintenance mode. Only admins can access it.",
    });
  };

  const getStatusBadge = (status: 'online' | 'offline') => {
    return status === 'online' ? (
      <Badge className="bg-green-500">
        <CheckCircle className="mr-1 h-3 w-3" />
        Online
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Offline
      </Badge>
    );
  };

  if (!userData || userData.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">System Settings</h1>
              <p className="text-muted-foreground">Configure platform settings and monitor system health</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={checkSystemStatus}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Status
            </Button>
            <Button onClick={saveSettings} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Basic platform configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable to restrict access to admins only
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={toggleMaintenanceMode}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register
                      </p>
                    </div>
                    <Switch
                      checked={settings.registrationEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, registrationEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Require email verification for new accounts
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailVerificationRequired}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailVerificationRequired: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span className="text-sm">Database</span>
                    </div>
                    {getStatusBadge(systemStatus.database)}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">AI Service</span>
                    </div>
                    {getStatusBadge(systemStatus.aiService)}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">Payment Gateway</span>
                    </div>
                    {getStatusBadge(systemStatus.paymentGateway)}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Storage</span>
                    </div>
                    {getStatusBadge(systemStatus.storage)}
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Last checked: {new Date(systemStatus.lastChecked).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Configuration</CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>AI Model</Label>
                    <Select value={settings.aiModel} onValueChange={(value) => setSettings(prev => ({ ...prev, aiModel: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select value={settings.defaultLanguage} onValueChange={(value) => setSettings(prev => ({ ...prev, defaultLanguage: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
                <CardDescription>Configure canvas limits for different plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Free Plan Limit</Label>
                    <Input
                      type="number"
                      value={settings.maxFreeCanvases}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxFreeCanvases: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">Maximum canvases for free users</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Pro Plan Limit</Label>
                    <Input
                      type="number"
                      value={settings.maxProCanvases}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxProCanvases: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">Maximum canvases for Pro users</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Premium Plan Limit</Label>
                    <Input
                      type="number"
                      value={settings.maxPremiumCanvases}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxPremiumCanvases: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">Maximum canvases for Premium users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>Monitor third-party service connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Supabase</p>
                        <p className="text-sm text-muted-foreground">Database & Auth</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">OpenAI</p>
                        <p className="text-sm text-muted-foreground">AI Services</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">LemonSqueezy</p>
                        <p className="text-sm text-muted-foreground">Payments</p>
                      </div>
                    </div>
                    <Badge variant="outline">Pending Setup</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <div>
                        <p className="font-medium">Google Analytics</p>
                        <p className="text-sm text-muted-foreground">Analytics</p>
                      </div>
                    </div>
                    <Badge variant="outline">Not Configured</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Monitoring</CardTitle>
                <CardDescription>Real-time system metrics and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Active Users</span>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Currently online</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Total Canvases</span>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Created today</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold">$0</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Recent Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>LemonSqueezy integration not configured</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>All core services operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Maintenance Mode Dialog */}
        <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enable Maintenance Mode</DialogTitle>
              <DialogDescription>
                This will restrict access to the platform to admin users only. Regular users will see a maintenance page.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Maintenance Message (Optional)</Label>
                <Textarea
                  placeholder="Enter a message to display to users during maintenance..."
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={enableMaintenanceMode}>
                Enable Maintenance Mode
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
