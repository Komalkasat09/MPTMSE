// /app/dashboard/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, LayoutGrid, ClipboardList, UserCheck, Calendar, Clock, TrendingUp, Users, BookOpen, Target, Award, AlertCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, Area, AreaChart } from 'recharts';
import attendanceData from '@/data/attendance.json';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showReports, setShowReports] = useState(false);

  const { overview, monthlyAttendance, subjectWiseAttendance, weeklyPattern, testMarks, recentActivity, goals } = attendanceData;
  
  // Calculate average test score and prepare test performance data for chart
  const averageTestScore = testMarks.reduce((acc, subject) => acc + subject.average, 0) / testMarks.length;
  
  // Transform test marks data for better chart display
  const testPerformanceData = testMarks.map(subject => ({
    subject: subject.subject,
    average: subject.average
  }));

  // Get match color based on score
  const getMatchColor = (score: number): string => {
    if (score >= 85) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  // Get match background color
  const getMatchBgColor = (score: number): string => {
    if (score >= 85) return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (score >= 70) return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    if (score >= 50) return "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
    return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  // Get match label
  const getMatchLabel = (score: number): string => {
    if (score >= 85) return "Excellent Match";
    if (score >= 70) return "Good Match";
    if (score >= 50) return "Fair Match";
    return "Poor Match";
  };

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
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">Here's a summary of your campus activities.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowReports(!showReports)}
            variant={showReports ? "default" : "outline"}
            className="border border-border"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showReports ? "Hide Reports" : "Student Reports"}
          </Button>
          <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-4 py-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Current Semester: 6th</span>
          </div>
        </div>
      </div>

      {/* Summary Cards - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.attendancePercentage}%</div>
            <Progress value={overview.attendancePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {overview.lecturesNeeded} more lectures to meet goal
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.attendedClasses}</div>
            <p className="text-xs text-muted-foreground">out of {overview.totalClasses} total</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Test Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTestScore.toFixed(1)}%</div>
            <Badge variant="secondary" className="mt-2">
              Excellent
            </Badge>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Track their status</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Section - Conditionally Rendered */}
      {showReports && (
        <div className="space-y-8 smooth-slide-in">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Detailed Academic Reports
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Attendance Trend */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  Monthly Attendance Trend
                </CardTitle>
                <CardDescription>Your attendance percentage over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyAttendance}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="percentage"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorAttendance)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject-wise Attendance */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  Subject-wise Performance
                </CardTitle>
                <CardDescription>Attendance percentage by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectWiseAttendance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="code" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="percentage" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Pattern and Test Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Pattern */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Weekly Attendance Pattern
                </CardTitle>
                <CardDescription>Your attendance by day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyPattern}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="attendanceRate" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Test Performance */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  Test Performance Overview
                </CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={testPerformanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" domain={[0, 100]} />
                    <YAxis dataKey="subject" type="category" stroke="#9CA3AF" width={130} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value}%`, 'Average Score']}
                    />
                    <Bar dataKey="average" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Subject Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">{item.subject}</p>
                        <p className="text-sm text-muted-foreground">{item.date} • {item.time}</p>
                      </div>
                      <Badge 
                        variant={item.status === "present" ? "default" : "destructive"}
                      >
                        {item.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance Details */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  Subject Performance
                </CardTitle>
                <CardDescription>Detailed subject-wise breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectWiseAttendance.slice(0, 4).map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{subject.subject}</p>
                          <p className="text-sm text-muted-foreground">{subject.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{subject.percentage}%</p>
                          <p className="text-xs text-muted-foreground">{subject.attendedClasses}/{subject.totalClasses}</p>
                        </div>
                      </div>
                      <Progress value={subject.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Achievement Card */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                Attendance Goal Tracker
              </CardTitle>
              <CardDescription>Track your progress towards the attendance goal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{goals.currentAttendance}%</div>
                  <p className="text-sm text-muted-foreground">Current</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{goals.targetAttendance}%</div>
                  <p className="text-sm text-muted-foreground">Target</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{goals.lecturesNeeded}</div>
                  <p className="text-sm text-muted-foreground">Lectures Needed</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(goals.currentAttendance / goals.targetAttendance) * 100} className="h-3" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Progress to Goal</span>
                  <span>{goals.daysRemaining} days remaining</span>
                </div>
              </div>
              {!goals.canAchieve && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">
                    You need to attend more classes consistently to achieve your goal
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Separator className="my-8" />

      {/* Recommended Applications Section */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Recommended For You</h2>
        <p className="text-muted-foreground text-sm">Opportunities based on your profile and interests.</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {isLoadingData ? (
            <p>Loading opportunities...</p>
          ) : (
            tasks.map(task => {
              console.log('Task:', task.title, 'Match Score:', task.matchScore); // Debug log
              return (
              <Card key={task.id} className="flex flex-col border border-border relative">
                {/* Match Score Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold border ${getMatchBgColor(task.matchScore || 0)}`}>
                  <span className={getMatchColor(task.matchScore || 0)}>{task.matchScore || 0}% Match</span>
                </div>
                
                <CardHeader className="pr-20">
                  <CardTitle>{task.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <UserCheck className="h-3 w-3 mr-1" /> Posted by {task.postedByName}
                  </div>
                  <div className="text-sm space-y-1">
                    <p><strong>Slots:</strong> {task.slots}</p>
                    <p><strong>Skills:</strong> {task.eligibility.skills.join(', ')}</p>
                    <div className={`mt-2 px-2 py-1 rounded text-xs ${getMatchBgColor(task.matchScore || 0)}`}>
                      <span className={getMatchColor(task.matchScore || 0)}>
                        {getMatchLabel(task.matchScore || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button className="w-full">
                    View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )})
          )}
        </div>
      </div>
    </div>
  );
}