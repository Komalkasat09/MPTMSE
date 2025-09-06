// /app/signup/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

// --- TypeScript Interfaces for Form Data ---
interface StudentFormData {
  fullName: string; sapId: string; branch: string; year: string; idCard: File | null; password: string; confirmPassword?: string;
  phone: string; email: string; linkedin: string; resume: File | null; github: string; bio: string;
}
interface FacultyFormData {
  fullName: string; branch: string; phone: string; designation: string; email: string; password: string;
}
// CORRECTED: Committee interface now uses 'description'
interface CommitteeFormData {
  name: string; branch: string; description: string; email: string; phone: string; password: string;
}

// --- Initial State for Forms ---
const initialStudentFormData: StudentFormData = {
  fullName: "", sapId: "", branch: "", year: "", idCard: null, password: "", confirmPassword: "",
  phone: "", email: "", linkedin: "", resume: null, github: "", bio: "",
};
const initialFacultyFormData: FacultyFormData = {
  fullName: "", branch: "", phone: "", designation: "", email: "", password: "",
};
// CORRECTED: Initial state now uses 'description'
const initialCommitteeFormData: CommitteeFormData = {
  name: "", branch: "", description: "", email: "", phone: "", password: "",
};


// --- MEMOIZED FORM COMPONENTS (DEFINED OUTSIDE THE MAIN COMPONENT) ---

// Props definition for our stable components
interface StudentFormProps {
  formData: StudentFormData;
  setFormData: React.Dispatch<React.SetStateAction<StudentFormData>>;
  step: number;
}

const StudentForm = React.memo(({ formData, setFormData, step }: StudentFormProps) => {
  const handleInputChange = (field: keyof StudentFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
          <div className="space-y-2"><Label>Full Name*</Label><Input value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} /></div>
          <div className="space-y-2"><Label>SAP ID*</Label><Input value={formData.sapId} onChange={(e) => handleInputChange("sapId", e.target.value)} /></div>
          <div className="space-y-2"><Label>Branch*</Label><Select onValueChange={(v) => handleInputChange("branch", v)}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent><SelectItem value="comps">Computer Science</SelectItem><SelectItem value="it">IT</SelectItem><SelectItem value="extc">Electronics</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label>Year*</Label><Select onValueChange={(v) => handleInputChange("year", v)}><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger><SelectContent><SelectItem value="1">1st</SelectItem><SelectItem value="2">2nd</SelectItem><SelectItem value="3">3rd</SelectItem><SelectItem value="4">4th</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label>Password*</Label><Input type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} /></div>
          <div className="space-y-2"><Label>Confirm Password*</Label><Input type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} /></div>
          <div className="space-y-2 md:col-span-2"><Label>ID Card*</Label><Input type="file" onChange={(e) => handleInputChange("idCard", e.target.files?.[0] || null)} /></div>
        </div>
      )}
      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
           <div className="space-y-2"><Label>Phone No*</Label><Input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} /></div>
           <div className="space-y-2"><Label>Email*</Label><Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} /></div>
           <div className="space-y-2"><Label>LinkedIn Profile</Label><Input value={formData.linkedin} onChange={(e) => handleInputChange("linkedin", e.target.value)} /></div>
           <div className="space-y-2"><Label>GitHub Profile</Label><Input value={formData.github} onChange={(e) => handleInputChange("github", e.target.value)} /></div>
           <div className="space-y-2 md:col-span-2"><Label>Resume</Label><Input type="file" onChange={(e) => handleInputChange("resume", e.target.files?.[0] || null)} /></div>
           <div className="space-y-2 md:col-span-2"><Label>Short Bio</Label><Textarea placeholder="Tell us about yourself..." value={formData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} /></div>
        </div>
      )}
    </>
  )
});
StudentForm.displayName = 'StudentForm';

const FacultyForm = React.memo(({ formData, setFormData }: { formData: FacultyFormData; setFormData: React.Dispatch<React.SetStateAction<FacultyFormData>> }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
      <div className="space-y-2"><Label>Full Name*</Label><Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} /></div>
      <div className="space-y-2"><Label>Designation*</Label><Input value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} /></div>
      <div className="space-y-2"><Label>Branch*</Label><Select onValueChange={(v) => setFormData({...formData, branch: v})}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent><SelectItem value="comps">Computer Science</SelectItem><SelectItem value="it">IT</SelectItem></SelectContent></Select></div>
      <div className="space-y-2"><Label>Phone No*</Label><Input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
      <div className="space-y-2 md:col-span-2"><Label>Email*</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
      <div className="space-y-2 md:col-span-2"><Label>Password*</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
  </div>
));
FacultyForm.displayName = 'FacultyForm';

// CORRECTED: The CommitteeForm component is fully updated
const CommitteeForm = React.memo(({ formData, setFormData }: { formData: CommitteeFormData; setFormData: React.Dispatch<React.SetStateAction<CommitteeFormData>> }) => (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
      <div className="space-y-2"><Label>Committee Name*</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
      <div className="space-y-2"><Label>Branch*</Label><Select onValueChange={(v) => setFormData({...formData, branch: v})}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent><SelectItem value="comps">Computer Science</SelectItem><SelectItem value="it">IT</SelectItem><SelectItem value="all">All Branches</SelectItem></SelectContent></Select></div>
      <div className="space-y-2 md:col-span-2"><Label>Description*</Label><Textarea placeholder="Tell us about your committee's mission and activities..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
      <div className="space-y-2"><Label>Contact Phone</Label><Input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
      <div className="space-y-2"><Label>Email*</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
      <div className="space-y-2 md:col-span-2"><Label>Password*</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
  </div>
));
CommitteeForm.displayName = 'CommitteeForm';


// --- MAIN PAGE COMPONENT ---
export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState("student");
  const [studentStep, setStudentStep] = useState(1);
  const [studentFormData, setStudentFormData] = useState<StudentFormData>(initialStudentFormData);
  const [facultyFormData, setFacultyFormData] = useState<FacultyFormData>(initialFacultyFormData);
  const [committeeFormData, setCommitteeFormData] = useState<CommitteeFormData>(initialCommitteeFormData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStudentNextStep = () => {
    const { fullName, sapId, branch, year, password, confirmPassword } = studentFormData;
    if (!fullName || !sapId || !branch || !year || !password || !confirmPassword) return toast.error("Please fill all required fields.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    setStudentStep(2);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let result;
    switch (selectedRole) {
      case 'student':
        if (!studentFormData.phone || !studentFormData.email) { setIsLoading(false); return toast.error("Please fill all required profiling fields."); }
        const studentApiData = { ...studentFormData }; delete studentApiData.confirmPassword;
        result = await api.signupStudent(studentApiData); break;
      case 'faculty':
        if (!facultyFormData.fullName || !facultyFormData.branch || !facultyFormData.phone || !facultyFormData.email || !facultyFormData.password) { setIsLoading(false); return toast.error("Please fill all required fields."); }
        result = await api.signupFaculty(facultyFormData); break;
      case 'committee':
         // CORRECTED: Validation now checks for 'description'
         if (!committeeFormData.name || !committeeFormData.branch || !committeeFormData.email || !committeeFormData.password || !committeeFormData.description) { setIsLoading(false); return toast.error("Please fill all required fields."); }
        result = await api.signupCommittee(committeeFormData); break;
    }
    if (result && result.success) { toast.success(result.message); router.push("/login"); } 
    else if (result) { toast.error(result.message); }
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
      
      <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-sm border-white/10">
        <CardHeader>
          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/20">
              <TabsTrigger value="student" className="data-[state=active]:bg-white data-[state=active]:text-black">Student</TabsTrigger>
              <TabsTrigger value="faculty" className="data-[state=active]:bg-white data-[state=active]:text-black">Faculty</TabsTrigger>
              <TabsTrigger value="committee" className="data-[state=active]:bg-white data-[state=active]:text-black">Committee</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="text-center pt-4">
            <CardTitle className="text-2xl font-bold">Create a {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account</CardTitle>
            <CardDescription>Join the platform to unlock your campus potential.</CardDescription>
          </div>
          {selectedRole === 'student' && <Progress value={studentStep * 50} className="w-full mt-4" />}
        </CardHeader>

        <CardContent>
          {selectedRole === 'student' && <StudentForm formData={studentFormData} setFormData={setStudentFormData} step={studentStep} />}
          {selectedRole === 'faculty' && <FacultyForm formData={facultyFormData} setFormData={setFacultyFormData} />}
          {selectedRole === 'committee' && <CommitteeForm formData={committeeFormData} setFormData={setCommitteeFormData} />}
        </CardContent>

        <CardFooter className="flex justify-between">
          {selectedRole === 'student' ? (
            <>
              {studentStep === 1 ? (<Link href="/login" className="text-sm"><Button variant="ghost">Already have an account?</Button></Link>) : (<Button variant="outline" onClick={() => setStudentStep(1)}>Back</Button>)}
              {studentStep === 1 ? (<Button onClick={handleStudentNextStep}>Next: Profiling</Button>) : (<Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Creating Account..." : "Create Account"}</Button>)}
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm"><Button variant="ghost">Already have an account?</Button></Link>
              <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Creating Account..." : "Create Account"}</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}