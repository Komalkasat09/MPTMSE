// /app/dashboard/tasks/page.tsx - Applications Page

"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Briefcase, UserCheck, CheckCircle, Building2, Users, Calendar, Award, Code, SlidersHorizontal } from 'lucide-react';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  const [motivation, setMotivation] = useState("");
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTask, setCurrentTask] = useState<any | null>(null);

  const fetchTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    const taskData = await api.getTasksForExplorer(user.id);
    setTasks(taskData);
    setIsLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [user]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Safe filtering with fallbacks
      const skillsString = (task.eligibility?.skills || []).join(' ').toLowerCase();
      const branches = (task.eligibility?.branches || []);
      
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            skillsString.includes(searchTerm.toLowerCase());
      const matchesTaskType = taskTypeFilter === 'all' || task.taskType === taskTypeFilter;
      const matchesBranch = branchFilter === 'all' || branches.includes(branchFilter) || branches.includes("All Branches");
      
      return matchesSearch && matchesTaskType && matchesBranch;
    });
  }, [tasks, searchTerm, taskTypeFilter, branchFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setTaskTypeFilter("all");
    setBranchFilter("all");
  };

  const handleApplicationSubmit = async () => {
    if (!motivation) return toast.error("Please provide a motivation for your application.");
    if (!user || !currentTask) return;

    setIsSubmitting(true);
    const result = await api.submitApplication({ 
      studentId: user.id, 
      taskId: currentTask.id, 
      motivation,
      useProfileResume
    });

    if (result.success) {
      toast.success(result.message);
      await fetchTasks();
      setCurrentTask(null); // Close the dialog on success
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8 items-start">
      {/* Filter Sidebar */}
      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" /><span>Filters</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Search by Keyword</Label><Input placeholder="Title, skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="space-y-2"><Label>Application Type</Label>
              <Select value={taskTypeFilter} onValueChange={setTaskTypeFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Research">Research</SelectItem><SelectItem value="Technical">Technical</SelectItem><SelectItem value="Management">Management</SelectItem><SelectItem value="Event Management">Event Management</SelectItem><SelectItem value="Creative">Creative</SelectItem><SelectItem value="Volunteering">Volunteering</SelectItem><SelectItem value="Academic">Academic</SelectItem></SelectContent>
              </Select>
            </div>
             <div className="space-y-2"><Label>Branch</Label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Branches</SelectItem><SelectItem value="Computer Science">Computer Science</SelectItem><SelectItem value="Information Technology">Information Technology</SelectItem><SelectItem value="Electronics">Electronics</SelectItem></SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="w-full mt-4"
              size="sm"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Task Grid */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Applications & Opportunities</h1>
            <p className="text-muted-foreground">{filteredTasks.length} opportunities found out of {tasks.length} total.</p>
            {(taskTypeFilter !== 'all' || branchFilter !== 'all' || searchTerm) && (
              <p className="text-xs text-muted-foreground mt-1">
                Active filters: {taskTypeFilter !== 'all' ? `Type: ${taskTypeFilter}` : ''} 
                {branchFilter !== 'all' ? ` Branch: ${branchFilter}` : ''} 
                {searchTerm ? ` Search: "${searchTerm}"` : ''}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 mt-6 animate-in fade-in duration-500">
          {isLoading ? <p>Loading opportunities...</p> : filteredTasks.map((task) => (
            <Card key={task.id} className="flex flex-col hover:border-primary transition-all">
              <CardHeader>
                <div className="flex justify-between items-start"><CardTitle className="text-lg">{task.title}</CardTitle><Badge variant="outline">{task.taskType}</Badge></div>
                <CardDescription className="line-clamp-2 h-[40px] pt-1">{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="text-xs text-muted-foreground flex items-center"><UserCheck className="h-3 w-3 mr-2" />Posted by {task.postedByName}</div>
                <div className="flex flex-wrap gap-1">
                  {(task.eligibility?.skills || []).map((skill: string) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start space-y-2">
                <Separator />
                <div className="flex justify-between w-full text-xs text-muted-foreground pt-2">
                  {/* THE FIX: Applying optional chaining and fallback arrays */}
                  <div className="flex items-center gap-1"><Building2 className="h-3 w-3" /><span>{(task.eligibility?.branches || []).join(', ')}</span></div>
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>Years {(task.eligibility?.years || []).join(', ')}</span></div>
                  <div className="flex items-center gap-1"><Award className="h-3 w-3" /><span>CGPA: {task.eligibility?.minCgpa || 'N/A'}+</span></div>
                </div>
                <Dialog open={currentTask?.id === task.id} onOpenChange={(isOpen) => !isOpen && setCurrentTask(null)}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-2" variant={task.hasApplied ? "outline" : "default"} disabled={task.hasApplied} onClick={() => { setMotivation(''); setUseProfileResume(true); setCurrentTask(task); }}>
                      {task.hasApplied ? <><CheckCircle className="mr-2 h-4 w-4 text-green-500" />Applied</> : "View & Apply"}
                    </Button>
                  </DialogTrigger>
                  {currentTask && (
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader><DialogTitle>{currentTask.title}</DialogTitle><DialogDescription>Posted by {currentTask.postedByName}</DialogDescription></DialogHeader>
                      <div className="py-4 space-y-4">
                        <p className="text-sm text-muted-foreground">{currentTask.description}</p>
                        <div><h4 className="font-semibold mb-1">Eligibility</h4>
                          <ul className="list-disc list-inside text-sm">
                            <li>Required Skills: {(currentTask.eligibility?.skills || []).join(', ')}</li>
                            <li>Open to Years: {(currentTask.eligibility?.years || []).join(', ')}</li>
                            <li>Minimum CGPA: {currentTask.eligibility?.minCgpa > 0 ? currentTask.eligibility.minCgpa : 'Not applicable'}</li>
                          </ul>
                        </div>
                        <div className="space-y-2"><Label htmlFor="motivation">Why are you a good fit for this role?*</Label><Textarea id="motivation" placeholder="Briefly describe your relevant skills and motivation..." onChange={(e) => setMotivation(e.target.value)} /></div>
                        <div className="space-y-3 pt-2"><Label>Application Attachments</Label>
                          <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg"><Checkbox id="useProfileResume" checked={useProfileResume} onCheckedChange={(checked) => setUseProfileResume(Boolean(checked))} /><Label htmlFor="useProfileResume" className="text-sm font-medium leading-none cursor-pointer">Easy Apply with your saved profile resume.</Label></div>
                          <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg"><Checkbox id="useLinkedin" disabled /><Label htmlFor="useLinkedin" className="text-sm font-medium leading-none text-muted-foreground">Apply with LinkedIn (Coming Soon)</Label></div>
                          {!useProfileResume && (<div className="space-y-2 animate-in fade-in duration-300"><Label htmlFor="manualResume">Or, upload a new resume (PDF/DOCX)</Label><Input id="manualResume" type="file" /></div>)}
                        </div>
                      </div>
                      <div className="pt-2"><Button onClick={handleApplicationSubmit} disabled={isSubmitting} className="w-full">{isSubmitting ? "Submitting..." : "Submit Application"}</Button></div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
        {!isLoading && filteredTasks.length === 0 && <p className="text-center text-muted-foreground mt-12">No opportunities match your current filters.</p>}
      </div>
    </div>
  );
}