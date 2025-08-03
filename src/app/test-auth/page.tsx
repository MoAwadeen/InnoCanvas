'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

export default function TestAuthPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  const runTests = async () => {
    setIsTesting(true);
    const results: any = {};

    try {
      // Test 1: Environment Variables
      results.envVars = {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrlValid: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co'),
        supabaseKeyValid: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length > 50,
      };

      // Test 2: Supabase Connection
      try {
        const { data, error } = await supabase.auth.getSession();
        results.supabaseConnection = {
          success: !error,
          error: error?.message,
          hasSession: !!data.session,
        };
      } catch (error: any) {
        results.supabaseConnection = {
          success: false,
          error: error.message,
          hasSession: false,
        };
      }

      // Test 3: Google OAuth Configuration
      try {
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
        
        results.googleOAuth = {
          success: !error,
          error: error?.message,
          hasData: !!data,
          url: data?.url,
        };
      } catch (error: any) {
        results.googleOAuth = {
          success: false,
          error: error.message,
          hasData: false,
          url: null,
        };
      }

      // Test 4: Current URL and Origin
      results.urlInfo = {
        origin: window.location.origin,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      };

      setTestResults(results);
      
      toast({
        title: 'Tests Completed',
        description: 'Check the results below for any issues.',
      });

    } catch (error: any) {
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>OAuth Configuration Test</CardTitle>
            <CardDescription>
              This page helps debug OAuth configuration issues. Run the tests to check your setup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run Configuration Tests'
              )}
            </Button>
          </CardContent>
        </Card>

        {testResults && (
          <div className="space-y-4">
            {/* Environment Variables Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.envVars.supabaseUrl && testResults.envVars.supabaseKey)}
                  Environment Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Supabase URL:</span>
                    <span className={testResults.envVars.supabaseUrl ? 'text-green-600' : 'text-red-600'}>
                      {testResults.envVars.supabaseUrl ? '✅ Set' : '❌ Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supabase Key:</span>
                    <span className={testResults.envVars.supabaseKey ? 'text-green-600' : 'text-red-600'}>
                      {testResults.envVars.supabaseKey ? '✅ Set' : '❌ Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>URL Valid:</span>
                    <span className={testResults.envVars.supabaseUrlValid ? 'text-green-600' : 'text-red-600'}>
                      {testResults.envVars.supabaseUrlValid ? '✅ Valid' : '❌ Invalid'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Key Valid:</span>
                    <span className={testResults.envVars.supabaseKeyValid ? 'text-green-600' : 'text-red-600'}>
                      {testResults.envVars.supabaseKeyValid ? '✅ Valid' : '❌ Invalid'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supabase Connection Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.supabaseConnection.success)}
                  Supabase Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Connection:</span>
                    <span className={testResults.supabaseConnection.success ? 'text-green-600' : 'text-red-600'}>
                      {testResults.supabaseConnection.success ? '✅ Connected' : '❌ Failed'}
                    </span>
                  </div>
                  {testResults.supabaseConnection.error && (
                    <div className="text-red-600 text-xs">
                      Error: {testResults.supabaseConnection.error}
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Session:</span>
                    <span className={testResults.supabaseConnection.hasSession ? 'text-green-600' : 'text-yellow-600'}>
                      {testResults.supabaseConnection.hasSession ? '✅ Active' : '⚠️ None'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google OAuth Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.googleOAuth.success)}
                  Google OAuth Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Configuration:</span>
                    <span className={testResults.googleOAuth.success ? 'text-green-600' : 'text-red-600'}>
                      {testResults.googleOAuth.success ? '✅ Valid' : '❌ Invalid'}
                    </span>
                  </div>
                  {testResults.googleOAuth.error && (
                    <div className="text-red-600 text-xs">
                      Error: {testResults.googleOAuth.error}
                    </div>
                  )}
                  {testResults.googleOAuth.url && (
                    <div className="text-xs break-all">
                      <span className="font-semibold">OAuth URL:</span><br />
                      {testResults.googleOAuth.url}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* URL Information */}
            <Card>
              <CardHeader>
                <CardTitle>Current URL Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Origin:</span>
                    <span className="text-blue-600">{testResults.urlInfo.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pathname:</span>
                    <span className="text-blue-600">{testResults.urlInfo.pathname}</span>
                  </div>
                  {testResults.urlInfo.search && (
                    <div className="flex justify-between">
                      <span>Search:</span>
                      <span className="text-blue-600">{testResults.urlInfo.search}</span>
                    </div>
                  )}
                  {testResults.urlInfo.hash && (
                    <div className="flex justify-between">
                      <span>Hash:</span>
                      <span className="text-blue-600 break-all">{testResults.urlInfo.hash}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 