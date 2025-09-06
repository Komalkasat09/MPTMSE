// /app/dashboard/page.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // While loading the user session, show a blank screen or a spinner
  if (isLoading) {
    return <div className="min-h-screen"></div>;
  }

  // If the user is not logged in after loading, this component will have redirected.
  // We can safely render the dashboard for the logged-in user.
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Welcome, {user.name}!</h1>
        <p className="mt-2 text-lg text-muted-foreground">You are logged in as a {user.role}.</p>
        <p className="mt-4">This is your dashboard. More content coming soon!</p>
        <Button onClick={logout} className="mt-8">
          Log Out
        </Button>
      </div>
    );
  }

  // This part should ideally not be reached due to the redirect
  return null;
}