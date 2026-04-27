import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, Search, ShieldAlert, CheckCircle2, ChevronRight, UploadCloud, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const verificationTasks = [
  { id: "V922", school: "ZP School Dhadgaon 3", issue: "Enrollment mismatch (+22%)", status: "pending", date: "Apr 24, 2026", distance: "45km" },
  { id: "V945", school: "Govt Higher School Molgi 1", issue: "GPS Coordinates invalid", status: "pending", date: "Apr 26, 2026", distance: "32km" },
  { id: "V911", school: "Tribal Ashram Toranmal", issue: "Teacher roster incomplete", status: "verified", date: "Apr 21, 2026", distance: "60km" },
];

export default function FieldVerification() {
  return (
    <div className="p-4 lg:p-6 lg:ml-60 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Field Verification</h1>
        <p className="text-muted-foreground">Manage ground-truth checks against UDISE+ anomaly reports.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-surface-mid">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Pending Verifications</div>
              <div className="text-2xl font-bold mt-1">42</div>
            </div>
            <div className="size-10 rounded-full bg-warning/10 flex items-center justify-center">
              <ShieldAlert className="size-5 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface-mid">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Verified This Week</div>
              <div className="text-2xl font-bold mt-1">18</div>
            </div>
            <div className="size-10 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <Button variant="default" className="w-full gap-2">
               <UploadCloud className="size-4" /> 
               Bulk Sync DB
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
          <div>
            <CardTitle>On-Ground Task List</CardTitle>
            <CardDescription>Schools flagged for physical verification by field officers.</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search school or ID..." className="pl-9 h-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationTasks.map((task) => (
              <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg bg-surface-mid/50 hover:bg-surface-elevated transition">
                <div className="flex gap-4 items-start">
                  <div className={`mt-0.5 size-2 rounded-full ${task.status === 'verified' ? 'bg-success' : 'bg-warning'} shrink-0`} />
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                       {task.school}
                       <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-border text-muted-foreground font-mono">{task.id}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-warning flex items-center gap-1.5 flex-wrap">
                       <ShieldAlert className="size-3" /> {task.issue}
                       <span className="text-muted-foreground/40 px-1">|</span>
                       <MapPin className="size-3 text-muted-foreground" /> <span className="text-foreground">{task.distance} from HQ</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                   {task.status === 'verified' ? (
                     <div className="px-3 py-1.5 text-xs font-medium text-success bg-success/10 rounded border border-success/20 inline-flex items-center gap-1.5">
                       <CheckCircle2 className="size-3" /> Data Corrected
                     </div>
                   ) : (
                     <Dialog>
                       <DialogTrigger asChild>
                         <Button size="sm" variant="outline" className="w-full sm:w-auto gap-1">
                           Review <ChevronRight className="size-3" />
                         </Button>
                       </DialogTrigger>
                       <DialogContent>
                         <DialogHeader>
                           <DialogTitle>Verification Task {task.id}</DialogTitle>
                           <DialogDescription>Submit officer field report.</DialogDescription>
                         </DialogHeader>
                         <div className="space-y-4 py-4">
                           <div className="p-3 bg-warning/10 border border-warning/20 rounded-md text-sm">
                             <div className="font-semibold text-warning mb-1">Discrepancy Details</div>
                             System shows 300 pupils, but local DB proxy returns 366. Requires physical headcount ledger stamp to authorize new teacher post.
                           </div>
                           <Button className="w-full gap-2">
                             <BadgeCheck className="size-4" /> Approve Field Correction
                           </Button>
                         </div>
                       </DialogContent>
                     </Dialog>
                   )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
