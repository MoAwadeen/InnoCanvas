'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export function AuthTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    try {
      // Test 1: Environment Variables
      addResult('Testing environment variables...');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
        addResult('❌ NEXT_PUBLIC_SUPABASE_URL is not configured');
      } else {
        addResult('✅ NEXT_PUBLIC_SUPABASE_URL is configured');
      }
      
      if (!supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
        addResult('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
      } else {
        addResult('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is configured');
      }

      // Test 2: Supabase Client
      addResult('Testing Supabase client...');
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          addResult(`❌ Supabase client error: ${error.message}`);
        } else {
          addResult('✅ Supabase client is working');
        }
      } catch (error: any) {
        addResult(`❌ Supabase client test failed: ${error.message}`);
      }

      // Test 3: Google OAuth Configuration
      addResult('Testing Google OAuth configuration...');
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });
        
        if (error) {
          addResult(`❌ Google OAuth error: ${error.message}`);
        } else {
          addResult('✅ Google OAuth configuration is working');
          addResult('✅ You should be redirected to Google OAuth consent screen');
        }
      } catch (error: any) {
        addResult(`❌ Google OAuth test failed: ${error.message}`);
      }

    } catch (error: any) {
      addResult(`❌ Test suite failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Configuration Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={runTests} 
          disabled={isTesting}
          className="mb-4"
        >
          {isTesting ? 'Running Tests...' : 'Run Configuration Tests'}
        </Button>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Test Results:</h3>
          <div className="bg-gray-100 p-4 rounded-md max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">Click "Run Configuration Tests" to start testing</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h4 className="font-semibold text-blue-800">What to do next:</h4>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• If environment variables are not configured, update your .env.local file</li>
            <li>• If Supabase client fails, check your Supabase project settings</li>
            <li>• If Google OAuth fails, configure Google OAuth in your Supabase dashboard</li>
            <li>• Restart your development server after making changes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 