import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { School2, MapPin, Calendar, Clock, BookOpen, ExternalLink, Settings, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="p-4 lg:p-6 lg:ml-60 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Teacher Portal</h1>
        <p className="text-muted-foreground">Welcome, {user?.name}. Here is your current assignment overview.</p>
      </div>

      <Card className="bg-gradient-to-br from-surface-mid to-background border-border relative overflow-hidden">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transfer & Deployment</CardTitle>
            <CardDescription>Status of your allocation requests or pending moves.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="bg-surface-elevated p-4 rounded-lg border border-border text-center flex flex-col items-center justify-center py-8">
                <Clock className="size-10 text-muted-foreground mb-3 opacity-50" />
                <h3 className="font-semibold text-lg">No Pending Transfers</h3>
                <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-1">You are not currently flagged for redistribution in the District deployment plan.</p>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resources & Actions</CardTitle>
            <CardDescription>Quick links for your daily activities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <Dialog>
               <DialogTrigger asChild>
                 <Button className="w-full justify-between" variant="outline">
                    Submit Attendance / Leave Request
                    <ExternalLink className="size-4 opacity-50" />
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Leave Request</DialogTitle>
                   <DialogDescription>Submit your application for upcoming leave.</DialogDescription>
                 </DialogHeader>
                 <div className="py-6 text-center text-muted-foreground">
                    <CheckCircle2 className="size-12 mx-auto mb-4 text-success opacity-50" />
                    This portal integrates directly with the state HRMS system in the production version.
                 </div>
               </DialogContent>
             </Dialog>

             <Dialog>
               <DialogTrigger asChild>
                 <Button className="w-full justify-between" variant="outline">
                    Update Profile & Skills
                    <Settings className="size-4 opacity-50" />
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Update Skills Framework</DialogTitle>
                   <DialogDescription>Keep your profile current to improve deployment match algorithms.</DialogDescription>
                 </DialogHeader>
                 <div className="py-4 space-y-4">
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Alternative Contact Number</label>
                       <input type="text" className="w-full bg-surface-mid border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition" placeholder="+91" defaultValue="+91 98765 43210" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Extra Curricular Specialization</label>
                       <select className="w-full bg-surface-mid border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition">
                          <option>None Selected</option>
                          <option>NCC Officer</option>
                          <option>Sports/PT Leader</option>
                          <option>Computer / ICT</option>
                          <option>Scouts & Guides</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Local Language Fluency</label>
                       <div className="flex items-center gap-4 mt-1">
                          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Marathi</label>
                          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Hindi</label>
                          <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Bhili</label>
                          <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Pawari</label>
                       </div>
                       <p className="text-xs text-muted-foreground pt-1">Adding tribal languages drastically improves your priority in nearby tribal talukas.</p>
                    </div>
                 </div>
                 <div className="flex justify-end pt-2">
                    <Button onClick={() => {
                        toast.success("Profile updated!", { description: "The deployment engine has registered your changes." });
                        document.body.click(); // Close dialog hack
                    }} className="w-full">Save Changes</Button>
                 </div>
               </DialogContent>
             </Dialog>

             <Dialog>
               <DialogTrigger asChild>
                 <Button className="w-full justify-between" variant="outline">
                    District Briefings & Memos
                    <BookOpen className="size-4 opacity-50" />
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Active Briefings</DialogTitle>
                   <DialogDescription>Read the latest communications from the Collector.</DialogDescription>
                 </DialogHeader>
                 <div className="py-4 space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="font-medium text-sm">Deployment Phase 1 Commences</div>
                      <div className="text-xs text-muted-foreground">Issued: Apr 24, 2026</div>
                    </div>
                 </div>
               </DialogContent>
             </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
