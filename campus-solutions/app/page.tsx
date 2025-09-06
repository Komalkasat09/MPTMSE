// /app/page.tsx -- The new Landing Page

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { BookOpenCheck } from "lucide-react"; // A nice icon for our app
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <BookOpenCheck className="h-6 w-6 mr-2" />
            <span className="font-bold">Campus Solutions</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="container text-center px-4">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Unlock Your Campus Potential
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
              A centralized hub for students, faculty, and committees. Discover
              opportunities, manage tasks, and connect with your college
              community like never before.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link href="/login" passHref>
                <Button size="lg">Sign In</Button>
              </Link>
              <Link href="/signup" passHref>
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}