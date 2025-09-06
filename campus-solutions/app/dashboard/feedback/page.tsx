// /app/dashboard/feedback/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from 'sonner';
import { Star, MessageSquareQuote, Send } from 'lucide-react';

export default function FeedbackPage() {
  const { user } = useAuth();
  const [committees, setCommittees] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [target, setTarget] = useState('');
  const [rating, setRating] = useState([3]);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { committees: committeeData, faculty: facultyData } = await api.getFeedbackTargets();
      setCommittees(committeeData);
      setFaculty(facultyData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!target || !comment) {
      return toast.error("Please select a target and leave a comment.");
    }
    if (!user) return;

    setIsSubmitting(true);
    const [targetType, targetId] = target.split(':'); // e.g., "committee:committee-tech"

    const result = await api.submitFeedback({
      studentId: user.id,
      targetId,
      targetType: targetType as 'committee' | 'faculty',
      rating: rating[0],
      comment,
      isAnonymous,
    });

    if (result.success) {
      toast.success(result.message);
      // Reset form
      setTarget('');
      setRating([3]);
      setComment('');
      setIsAnonymous(false);
    } else {
      toast.error("Failed to submit feedback. Please try again.");
    }
    setIsSubmitting(false);
  };

  const ratingLabels = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submit Feedback</h1>
        <p className="text-muted-foreground">Help us improve by sharing your thoughts on committees and faculty.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>Your insights are valuable. All feedback is reviewed carefully.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="target">Who would you like to review?*</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger id="target">
                <SelectValue placeholder="Select a committee or faculty member..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Committees</SelectLabel>
                  {committees.map(c => <SelectItem key={c.id} value={`committee:${c.id}`}>{c.name}</SelectItem>)}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Faculty</SelectLabel>
                  {faculty.map(f => <SelectItem key={f.id} value={`faculty:${f.id}`}>{f.name}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Overall Rating: <span className="font-bold text-primary">{ratingLabels[rating[0] - 1]}</span></Label>
            <div className="flex items-center gap-4 pt-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <Slider
                value={rating}
                onValueChange={setRating}
                max={5}
                min={1}
                step={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Comments*</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience, suggestions, or praise..."
              rows={5}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(Boolean(checked))} />
            <Label htmlFor="anonymous" className="text-sm font-medium leading-none cursor-pointer">
              Submit Anonymously
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" /> Submit Feedback</>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}