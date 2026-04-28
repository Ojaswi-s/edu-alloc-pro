import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { School2, MapPin, Calendar, Clock, BookOpen, ExternalLink, Settings, CheckCircle2, TrendingUp, Inbox, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const attendanceData = [
  { name: 'Jan', attendance: 92 },
  { name: 'Feb', attendance: 94 },
  { name: 'Mar', attendance: 88 },
  { name: 'Apr', attendance: 95 },
  { name: 'May', attendance: 91 },
];

const studentProgress = [
  { name: 'Unit 1', avg: 68 },
  { name: 'Unit 2', avg: 72 },
  { name: 'Midterm', avg: 78 },
  { name: 'Unit 3', avg: 82 },
];

export default function TeacherDashboard() {
  const { user, updateUser } = useAuth();
  const [tempName, setName] = useState(user?.name || "");
  
  return (
    <div className="p-4 lg:p-6 lg:ml-60 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Teacher Portal</h1>
        <p className="text-muted-foreground">Welcome, {user?.name}. Here is your current assignment overview.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Posting Card */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-surface-mid to-background border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <School2 className="w-48 h-48" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <span className="px-2 py-1 bg-primary/10 rounded text-xs uppercase tracking-wider">Current Posting</span>
            </div>
            <CardTitle className="text-3xl">ZP School Shahada</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
               <MapPin className="size-4" /> Shahada Block, Nandurbar District (12km from home)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50">
              <div>
                 <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Subject</div>
                 <div className="font-semibold flex items-center gap-2"><BookOpen className="size-4 text-primary" /> Physics (PHY)</div>
              </div>
              <div>
                 <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Classes</div>
                 <div className="font-semibold">8th to 10th Standard</div>
              </div>
              <div>
                 <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Joined Date</div>
                 <div className="font-semibold flex items-center gap-2"><Calendar className="size-4 text-muted-foreground" /> June 2021</div>
              </div>
              <div>
                 <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                 <div className="font-semibold text-success flex items-center gap-2"><div className="size-2 bg-success rounded-full" /> Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Status */}
        <Card>
          <CardHeader>
            <CardTitle>Transfer & Deployment</CardTitle>
            <CardDescription>Request status.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="bg-surface-elevated p-4 rounded-lg border border-border text-center flex flex-col items-center justify-center py-6">
                <Clock className="size-10 text-muted-foreground mb-3 opacity-50" />
                <h3 className="font-semibold">No Pending Transfers</h3>
                <p className="text-xs text-muted-foreground mt-1 px-4">You are not currently flagged for redistribution.</p>
             </div>
             <Button variant="link" className="w-full mt-2 text-xs text-primary">Apply for mutual swap</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Performance / Impact Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle>Impact & Performance</CardTitle>
                  <CardDescription>Live classroom analytics from UDISE+.</CardDescription>
               </div>
               <TrendingUp className="size-5 text-accent-teal opacity-50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[220px]">
               <div className="space-y-4">
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Student Attendance Trend (%)</div>
                  <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={[80, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #333', borderRadius: '4px' }}
                        itemStyle={{ color: '#1b6df3' }}
                      />
                      <Line type="monotone" dataKey="attendance" stroke="#1b6df3" strokeWidth={3} dot={{ r: 4, fill: '#1b6df3' }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between items-center bg-surface-mid p-3 rounded border border-border">
                     <span className="text-sm font-medium">Class Participation</span>
                     <span className="text-sm font-bold text-success">+4.2% This Month</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Syllabus Completion (Unit Avg)</div>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={studentProgress}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #333', borderRadius: '4px' }}
                      />
                      <Bar dataKey="avg" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between items-center bg-surface-mid p-3 rounded border border-border">
                     <span className="text-sm font-medium">Curriculum Pace</span>
                     <span className="text-sm font-bold text-accent-teal">On Track</span>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources & Quick Actions */}
        <div className="space-y-6">
           <Card>
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">District Inbox</CardTitle>
               <CardDescription>Memos and official notifications.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-3">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-md hover:bg-primary/10 transition cursor-pointer group">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase">New Memo</span>
                      <span className="text-[10px] text-muted-foreground">2h ago</span>
                   </div>
                   <div className="text-sm font-semibold truncate group-hover:text-primary transition">Deployment Phase 1 Commences</div>
                   <div className="text-xs text-muted-foreground mt-0.5">Please verify your updated posting...</div>
                </div>
                <div className="p-3 bg-surface-mid border border-border rounded-md opacity-70">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">General</span>
                      <span className="text-[10px] text-muted-foreground">2d ago</span>
                   </div>
                   <div className="text-sm font-semibold truncate">Summer Training Schedule</div>
                </div>
                <Button variant="ghost" className="w-full text-xs gap-2 py-1"><Inbox className="size-3" /> View All Messages</Button>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Resource Hub</CardTitle>
               <CardDescription>Curriculum & teaching aids.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs"><FileText className="size-3.5 text-success" /> State PHY Curriculum 2026</Button>
                <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs"><Download className="size-3.5 text-primary" /> Classroom Lesson Templates</Button>
                <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs"><Settings className="size-3.5 text-muted-foreground" /> Manage Certifications</Button>
             </CardContent>
           </Card>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 px-6">
              <Settings className="size-4" /> Edit My Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Profile Settings</DialogTitle>
              <DialogDescription>Your info is used by the match algorithms for deployment.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface-mid border border-border rounded-md px-3 py-2 text-sm" 
                    value={tempName} 
                    onChange={e => setName(e.target.value)}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Number</label>
                  <input type="text" className="w-full bg-surface-mid border border-border rounded-md px-3 py-2 text-sm" placeholder="+91" defaultValue="+91 98765 43210" />
               </div>
               <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Teaching Philosophy / Bio</label>
                  <textarea rows={3} className="w-full bg-surface-mid border border-border rounded-md px-3 py-2 text-sm" defaultValue="Passionate about modern physics and practical learning. Focused on STEM excellence in rural clusters." />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">Extra Curricular</label>
                  <select className="w-full bg-surface-mid border border-border rounded-md px-3 py-2 text-sm">
                     <option>NCC Officer</option>
                     <option>Sports/PT Leader</option>
                     <option>Computer / ICT</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Subject</label>
                  <select className="w-full bg-surface-mid border border-border rounded-md px-3 py-2 text-sm">
                     <option>Physics (PHY)</option>
                     <option>Chemistry (CHM)</option>
                     <option>Mathematics (MAT)</option>
                  </select>
               </div>
               <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-xs text-muted-foreground uppercase tracking-widest">Languages Known</label>
                  <div className="flex gap-4 items-center pt-1 border border-border/50 rounded p-3">
                     <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Marathi</label>
                     <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Hindi</label>
                     <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Bhili</label>
                     <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Pawari</label>
                  </div>
               </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
               <DialogTrigger asChild><Button variant="ghost">Cancel</Button></DialogTrigger>
               <Button onClick={() => {
                  updateUser({ name: tempName });
                  toast.success("Profile Updated", { description: "Changes saved successfully." });
               }}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
