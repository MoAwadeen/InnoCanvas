'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="text-blue-500 underline">Go back home</a>
    </div>
  );
}