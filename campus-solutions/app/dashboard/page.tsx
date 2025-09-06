// /app/dashboard/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { ArrowUpRight, LayoutGrid, ClipboardList, UserCheck } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
    
    if (user) {
      const fetchData = async () => {
        setIsLoadingData(true);
        const taskData = await api.getDashboardTasks();
        setTasks(taskData);
        setIsLoadingData(false);
      };
      fetchData();
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return <div className="min-h-screen bg-background"></div>;
  }
  
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's a summary of your campus activities.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">3 more lectures to meet goal.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Track their status.</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="text-xl font-semibold tracking-tight">Recommended For You</h2>
        <p className="text-muted-foreground text-sm">Opportunities based on your profile and interests.</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {isLoadingData ? (
            <p>Loading opportunities...</p>
          ) : (
            tasks.map(task => (
              <Card key={task.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <UserCheck className="h-3 w-3 mr-1" /> Posted by {task.postedByName}
                  </div>
                  <div className="text-sm">
                    <p><strong>Slots:</strong> {task.slots}</p>
                    <p><strong>Skills:</strong> {task.eligibility.skills.join(', ')}</p>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button className="w-full">
                    View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}