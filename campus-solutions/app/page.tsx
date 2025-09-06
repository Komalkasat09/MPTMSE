// /app/page.tsx -- Modern Landing Page with Glass Effects

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpenCheck, Users, Calendar, MessageSquare, Trophy, Target, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-black dark:to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:bg-black/80 dark:supports-[backdrop-filter]:bg-black/60 dark:border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-white">
                <BookOpenCheck className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">Campus Solutions</span>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Features</a>
                <a href="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">About</a>
                <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Contact</a>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:px-8 lg:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              <div className="mb-8 flex justify-center">
                <div className="relative rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-900/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-100/10">
                  ✨ Transform Your Campus Experience
                </div>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-7xl">
                Unlock Your
                <span className="bg-gradient-to-r from-slate-600 to-slate-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400"> Campus Potential</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                A centralized hub designed for students, faculty, and committees. 
                Discover opportunities, manage tasks, and connect with your college community like never before.
              </p>
              <div className="mt-12 flex items-center justify-center gap-6">
                <Link href="/login">
                  <Button size="lg" className="bg-slate-900 px-8 py-3 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="px-8 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-24 lg:px-8">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
              Everything You Need to Excel
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Powerful features designed to streamline your campus experience and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Feature Cards */}
            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 dark:from-white/20 dark:to-white/10 mb-6 backdrop-blur-sm">
                  <Users className="h-7 w-7 text-white dark:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">Committee Management</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Efficiently organize and coordinate committee activities with streamlined communication and task management.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500/20 dark:to-blue-600/10 mb-6 backdrop-blur-sm">
                  <Calendar className="h-7 w-7 text-white dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">Event Planning</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Plan, organize, and manage campus events with integrated scheduling and attendance tracking.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500/20 dark:to-green-600/10 mb-6 backdrop-blur-sm">
                  <MessageSquare className="h-7 w-7 text-white dark:text-green-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors">Real-time Chat</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Connect instantly with peers, faculty, and committee members through integrated messaging.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-500/20 dark:to-purple-600/10 mb-6 backdrop-blur-sm">
                  <Trophy className="h-7 w-7 text-white dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">Achievement Tracking</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Monitor your progress and celebrate achievements with comprehensive tracking and analytics.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-500/20 dark:to-orange-600/10 mb-6 backdrop-blur-sm">
                  <Target className="h-7 w-7 text-white dark:text-orange-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-orange-800 dark:group-hover:text-orange-200 transition-colors">Task Management</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Stay organized with intelligent task management and deadline tracking across all your activities.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500/20 dark:to-indigo-600/10 mb-6 backdrop-blur-sm">
                  <CheckCircle className="h-7 w-7 text-white dark:text-indigo-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-indigo-800 dark:group-hover:text-indigo-200 transition-colors">Attendance System</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Automated attendance tracking with detailed analytics and reporting for all campus activities.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="container mx-auto">
          <div className="rounded-2xl bg-slate-900 dark:bg-black/90 backdrop-blur-xl px-8 py-16 lg:px-16 border dark:border-white/10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold text-white dark:text-white lg:text-5xl">10,000+</div>
                <div className="mt-2 text-slate-300 dark:text-slate-400">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white dark:text-white lg:text-5xl">500+</div>
                <div className="mt-2 text-slate-300 dark:text-slate-400">Committees Managed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white dark:text-white lg:text-5xl">98%</div>
                <div className="mt-2 text-slate-300 dark:text-slate-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
              Join thousands of students and faculty already using Campus Solutions to streamline their academic journey.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/signup">
                <Button size="lg" className="bg-slate-900 px-8 py-3 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 px-6 py-12 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
                <BookOpenCheck className="h-4 w-4 text-white dark:text-slate-900" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Campus Solutions</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 Campus Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}