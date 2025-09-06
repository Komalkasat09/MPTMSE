// /app/login/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/mockApi";
import { useAuth } from "@/hooks/useAuth"; // Import the auth hook
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Use the login function from our context

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please fill in both fields.");
    setIsLoading(true);

    const result = await api.login(email, password);
    if (result.success) {
      toast.success(result.message);
      login(result.user); // THIS IS THE KEY CHANGE. It logs the user in and redirects.
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">StudentHub</CardTitle>
          <CardDescription>Welcome back! Please sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="mehta@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} /></div>
          <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} /></div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>{isLoading ? "Signing In..." : "Sign In"}</Button>
          <p className="text-sm text-center text-muted-foreground">Don't have an account? <Link href="/signup" className="font-semibold text-primary hover:underline">Sign Up</Link></p>
        </CardFooter>
      </Card>
    </main>
  );
}