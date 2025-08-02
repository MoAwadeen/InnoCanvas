import { AuthTest } from '@/components/auth-test';

export default function TestAuthPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Authentication Configuration Test</h1>
        <AuthTest />
      </div>
    </div>
  );
} 