'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function DebugOAuthPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { toast } = useToast();

  const runDebugTests = async () => {
    setIsTesting(true);
    const info: any = {};

    try {
      // Test 1: Environment Variables
      info.environment = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
        nodeEnv: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL,
      };

      // Test 2: Current URL Info
      info.currentUrl = {
        origin: window.location.origin,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      };

      // Test 3: Supabase Client Info
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        info.supabaseClient = {
          hasSession: !!sessionData.session,
          sessionError: sessionError?.message || null,
          supabaseUrl: supabase.supabaseUrl,
        };
      } catch (error: any) {
        info.supabaseClient = {
          error: error.message,
        };
      }

      // Test 4: OAuth Configuration Test
      try {
        console.log('Testing OAuth configuration...');
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback',
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });
        
        info.oauthTest = {
          success: !error,
          error: error?.message || null,
          hasData: !!data,
          url: data?.url || null,
          provider: data?.provider || null,
        };

        if (data?.url) {
          info.oauthTest.redirectUrl = data.url;
          info.oauthTest.isLocalhost = data.url.includes('localhost');
          info.oauthTest.isSupabaseCallback = data.url.includes('ewetzmzfbwnqsdoikykz.supabase.co');
        }

      } catch (error: any) {
        info.oauthTest = {
          success: false,
          error: error.message,
          hasData: false,
          url: null,
        };
      }

      // Test 5: Browser Info
      info.browser = {
        userAgent: navigator.userAgent,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        language: navigator.language,
      };

      setDebugInfo(info);
      
      toast({
        title: 'Debug Tests Completed',
        description: 'Check the results below for detailed information.',
      });

    } catch (error: any) {
      toast({
        title: 'Debug Test Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (success: boolean, warning?: boolean) => {
    if (warning) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Debug information copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>OAuth Debug Information</CardTitle>
            <CardDescription>
              This page provides detailed debugging information for OAuth configuration issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={runDebugTests} 
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Running Debug Tests...
                  </>
                ) : (
                  'Run Debug Tests'
                )}
              </Button>
              
              {debugInfo && (
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(debugInfo, null, 2))}
                  variant="outline"
                  className="w-full"
                >
                  Copy Debug Info to Clipboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {debugInfo && (
          <div className="space-y-4">
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(!!debugInfo.environment.supabaseUrl && !!debugInfo.environment.supabaseKey)}
                  Environment Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Supabase URL:</span>
                    <span className="text-blue-600 break-all">{debugInfo.environment.supabaseUrl || 'NOT SET'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supabase Key:</span>
                    <span className={debugInfo.environment.supabaseKey === 'SET' ? 'text-green-600' : 'text-red-600'}>
                      {debugInfo.environment.supabaseKey}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Node Environment:</span>
                    <span className="text-blue-600">{debugInfo.environment.nodeEnv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vercel URL:</span>
                    <span className="text-blue-600">{debugInfo.environment.vercelUrl || 'NOT SET'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current URL */}
            <Card>
              <CardHeader>
                <CardTitle>Current URL Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Origin:</span>
                    <span className="text-blue-600">{debugInfo.currentUrl.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hostname:</span>
                    <span className="text-blue-600">{debugInfo.currentUrl.hostname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protocol:</span>
                    <span className="text-blue-600">{debugInfo.currentUrl.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pathname:</span>
                    <span className="text-blue-600">{debugInfo.currentUrl.pathname}</span>
                  </div>
                  {debugInfo.currentUrl.search && (
                    <div className="flex justify-between">
                      <span>Search:</span>
                      <span className="text-blue-600">{debugInfo.currentUrl.search}</span>
                    </div>
                  )}
                  {debugInfo.currentUrl.hash && (
                    <div className="flex justify-between">
                      <span>Hash:</span>
                      <span className="text-blue-600 break-all">{debugInfo.currentUrl.hash}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Supabase Client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(!debugInfo.supabaseClient.error)}
                  Supabase Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Connection:</span>
                    <span className={debugInfo.supabaseClient.error ? 'text-red-600' : 'text-green-600'}>
                      {debugInfo.supabaseClient.error ? 'Failed' : 'Connected'}
                    </span>
                  </div>
                  {debugInfo.supabaseClient.error && (
                    <div className="text-red-600 text-xs">
                      Error: {debugInfo.supabaseClient.error}
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Session:</span>
                    <span className={debugInfo.supabaseClient.hasSession ? 'text-green-600' : 'text-yellow-600'}>
                      {debugInfo.supabaseClient.hasSession ? 'Active' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supabase URL:</span>
                    <span className="text-blue-600 break-all">{debugInfo.supabaseClient.supabaseUrl}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OAuth Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.oauthTest.success)}
                  OAuth Configuration Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Configuration:</span>
                    <span className={debugInfo.oauthTest.success ? 'text-green-600' : 'text-red-600'}>
                      {debugInfo.oauthTest.success ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  {debugInfo.oauthTest.error && (
                    <div className="text-red-600 text-xs">
                      Error: {debugInfo.oauthTest.error}
                    </div>
                  )}
                  {debugInfo.oauthTest.url && (
                    <div className="text-xs break-all">
                      <span className="font-semibold">OAuth URL:</span><br />
                      {debugInfo.oauthTest.url}
                    </div>
                  )}
                  {debugInfo.oauthTest.redirectUrl && (
                    <div className="text-xs break-all">
                      <span className="font-semibold">Redirect URL:</span><br />
                      {debugInfo.oauthTest.redirectUrl}
                    </div>
                  )}
                  {debugInfo.oauthTest.isLocalhost !== undefined && (
                    <div className="flex justify-between">
                      <span>Contains localhost:</span>
                      <span className={debugInfo.oauthTest.isLocalhost ? 'text-red-600' : 'text-green-600'}>
                        {debugInfo.oauthTest.isLocalhost ? 'YES (PROBLEM)' : 'NO'}
                      </span>
                    </div>
                  )}
                  {debugInfo.oauthTest.isSupabaseCallback !== undefined && (
                    <div className="flex justify-between">
                      <span>Uses Supabase callback:</span>
                      <span className={debugInfo.oauthTest.isSupabaseCallback ? 'text-green-600' : 'text-red-600'}>
                        {debugInfo.oauthTest.isSupabaseCallback ? 'YES' : 'NO'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Browser Info */}
            <Card>
              <CardHeader>
                <CardTitle>Browser Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Online:</span>
                    <span className={debugInfo.browser.onLine ? 'text-green-600' : 'text-red-600'}>
                      {debugInfo.browser.onLine ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cookies Enabled:</span>
                    <span className={debugInfo.browser.cookieEnabled ? 'text-green-600' : 'text-red-600'}>
                      {debugInfo.browser.cookieEnabled ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="text-blue-600">{debugInfo.browser.language}</span>
                  </div>
                  <div className="text-xs break-all">
                    <span className="font-semibold">User Agent:</span><br />
                    {debugInfo.browser.userAgent}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 