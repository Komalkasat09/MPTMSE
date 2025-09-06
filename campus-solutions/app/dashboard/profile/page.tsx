// /app/dashboard/profile/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { User, Mail, Phone, Linkedin, Github, FileText, Pencil } from 'lucide-react';
import { TagInput } from '@/components/ui/tag-input'; // Import our new component

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setIsLoading(true);
        const profileData = await api.getStudentProfile(user.id);
        setProfile(profileData);
        // Ensure skills and interests are arrays even if they don't exist
        setEditData({
          ...profileData,
          skills: profileData?.skills || [],
          interests: profileData?.interests || [],
        });
        setIsLoading(false);
      };
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Handler for our new TagInput component
  const handleTagsChange = (field: 'skills' | 'interests', value: string[]) => {
    setEditData((prev: any) => ({...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!user) return;
    setIsUpdating(true);
    const result = await api.updateStudentProfile(user.id, editData);
    if (result.success) {
      toast.success(result.message);
      setProfile(result.user);
      login(result.user);
    } else {
      toast.error(result.message);
    }
    setIsUpdating(false);
  };

  if (isLoading || !profile) {
    return <p>Loading profile...</p>;
  }

  const allTags = [...(profile.skills || []), ...(profile.interests || [])];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">View and manage your personal and professional information.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Pencil className="mr-2 h-4 w-4" /> Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
              <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="phone">Phone No*</Label><Input id="phone" value={editData.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="email">Email*</Label><Input id="email" type="email" value={editData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="linkedin">LinkedIn</Label><Input id="linkedin" value={editData.linkedin || ''} onChange={(e) => handleInputChange('linkedin', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="github">GitHub</Label><Input id="github" value={editData.github || ''} onChange={(e) => handleInputChange('github', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={editData.bio || ''} onChange={(e) => handleInputChange('bio', e.target.value)} /></div>
              
              {/* NEW EDITABLE SKILLS AND INTERESTS */}
              <div className="space-y-2">
                <Label>Skills</Label>
                <TagInput 
                  value={editData.skills || []}
                  onChange={(newSkills) => handleTagsChange('skills', newSkills)}
                  placeholder="e.g., React, Python..."
                />
              </div>
              <div className="space-y-2">
                <Label>Interests</Label>
                <TagInput
                  value={editData.interests || []}
                  onChange={(newInterests) => handleTagsChange('interests', newInterests)}
                  placeholder="e.g., AI, Web Dev..."
                />
              </div>

            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" onClick={handleUpdate} disabled={isUpdating}>{isUpdating ? "Saving..." : "Save changes"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column (No changes) */}
        <div className="lg:col-span-1 space-y-6">
           <Card>
            <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{profile.name}</span></div>
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{profile.email}</span></div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{profile.phone}</span></div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader><CardTitle>Social & Professional Links</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3"><Linkedin className="h-4 w-4 text-muted-foreground" /><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">{profile.linkedin || 'Not provided'}</a></div>
              <div className="flex items-center gap-3"><Github className="h-4 w-4 text-muted-foreground" /><a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">{profile.github || 'Not provided'}</a></div>
              <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{profile.resumeUrl ? 'Resume on file' : 'Not uploaded'}</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>About Me</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{profile.bio || 'No bio provided.'}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Skills & Interests</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {allTags.length > 0 ? allTags.map((item: string, index: number) => (
                <Badge key={index} variant="secondary">{item}</Badge>
              )) : <p className="text-sm text-muted-foreground">No skills or interests added yet.</p>}
            </CardContent>
          </Card>
           <Card>
            <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
            <CardContent>
              {(profile.achievements?.length || 0) > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {(profile.achievements || []).map((ach: any, index: number) => (
                    <li key={index} className="text-sm"><span className="font-semibold">{ach.type}:</span> {ach.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No achievements listed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}