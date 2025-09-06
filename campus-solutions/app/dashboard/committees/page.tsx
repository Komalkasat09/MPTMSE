// /app/dashboard/committees/page.tsx

"use client";

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge"; // A nice touch for tags
import { Users, Building, Info } from 'lucide-react';

// Define a type for our committee data for better code completion
interface Committee {
  id: string;
  name: string;
  branch: string;
  description: string;
  coreMembers: { name: string; role: string }[];
  facultyCoordinatorId: string;
}

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const committeeData = await api.getCommittees();
      setCommittees(committeeData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // useMemo will re-calculate the filtered list only when the source data or filters change
  const filteredCommittees = useMemo(() => {
    return committees.filter(committee => {
      const matchesSearch = committee.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch = branchFilter === 'all' || committee.branch.toLowerCase() === branchFilter.toLowerCase();
      return matchesSearch && matchesBranch;
    });
  }, [committees, searchTerm, branchFilter]);

  // A helper to get all unique branches for the filter dropdown
  const uniqueBranches = useMemo(() => {
    const branches = new Set(committees.map(c => c.branch));
    return Array.from(branches);
  }, [committees]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discover Committees</h1>
          <p className="text-muted-foreground">Find your community and get involved on campus.</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
        <Input
          placeholder="Search by committee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto md:flex-1"
        />
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {uniqueBranches.map(branch => (
              <SelectItem key={branch} value={branch.toLowerCase()}>{branch}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Committee Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {isLoading ? (
          <p>Loading committees...</p>
        ) : filteredCommittees.length > 0 ? (
          filteredCommittees.map((committee) => (
            <Card key={committee.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{committee.name}</CardTitle>
                <CardDescription className="line-clamp-2 h-[40px]">{committee.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <Badge variant="outline">{committee.branch}</Badge>
              </CardContent>
              <CardFooter>
                 <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{committee.name}</DialogTitle>
                        <DialogDescription>{committee.branch}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-4 w-4 mt-1 text-muted-foreground" />
                          <p>{committee.description}</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <Users className="h-4 w-4 mt-1 text-muted-foreground" />
                           <div>
                             <h3 className="font-semibold">Core Members</h3>
                             <ul className="list-disc list-inside text-sm text-muted-foreground">
                               {committee.coreMembers.map(member => (
                                 <li key={member.name}>{member.name} ({member.role})</li>
                               ))}
                             </ul>
                           </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="md:col-span-3 text-center text-muted-foreground">No committees found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}