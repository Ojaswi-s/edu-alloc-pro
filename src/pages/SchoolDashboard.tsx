import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, AlertTriangle, ArrowRight, UploadCloud, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SchoolDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="p-4 lg:p-6 lg:ml-60 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">School Administration</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Here is your school's overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="size-4" />
              <span className="text-sm font-medium">Enrolled Students</span>
            </div>
            <div className="text-3xl font-bold">428</div>
            <div className="text-xs text-muted-foreground mt-1 text-success">+12 from last year</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BookOpen className="size-4" />
              <span className="text-sm font-medium">Teachers Present</span>
            </div>
            <div className="text-3xl font-bold">14<span className="text-muted-foreground text-lg">/18</span></div>
            <div className="text-xs text-warning mt-1">4 Vacancies currently reported</div>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-6 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-warning mb-1">
              <AlertTriangle className="size-4" />
              <span className="text-sm font-medium">RTE Compliance</span>
            </div>
            <div className="text-3xl font-bold text-warning">Violation</div>
            <div className="text-xs text-muted-foreground mt-1">PTR ratio exceeds 30:1 in 2 subjects</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Deployments</CardTitle>
            <CardDescription>Teachers assigned to join your school shortly.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-surface-mid">
                <div>
                  <div className="font-semibold text-sm">Priya Deshmukh</div>
                  <div className="text-xs text-muted-foreground">Physics Teacher · Joining May 4</div>
                </div>
                <Button size="sm" variant="outline">View Transfer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your school reporting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <Dialog>
               <DialogTrigger asChild>
                 <Button className="w-full justify-between" variant="outline">
                    Update UDISE+ Data
                    <UploadCloud className="size-4 opacity-50" />
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Sync with UDISE+</DialogTitle>
                   <DialogDescription>Fetch or Upload the latest district enrollment data.</DialogDescription>
                 </DialogHeader>
                 <div className="py-6 text-center text-muted-foreground">
                    Connecting to central UDISE+ registry. Please ensure your session is active in the state portal.
                 </div>
               </DialogContent>
             </Dialog>

             <Dialog>
               <DialogTrigger asChild>
                 <Button className="w-full justify-between" variant="outline">
                    Report Faculty Absence
                    <AlertTriangle className="size-4 text-warning opacity-80" />
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Report Absence</DialogTitle>
                   <DialogDescription>Submit emergency leave or unexplained absences.</DialogDescription>
                 </DialogHeader>
                 <div className="py-6 text-center text-muted-foreground">
                    This will notify the district collector and impact deployment matching.
                 </div>
               </DialogContent>
             </Dialog>

             <Dialog>
               <DialogTrigger asChild>
                 <Button className="w-full justify-between" variant="outline">
                    Submit Monthly Returns
                    <FileText className="size-4 opacity-50" />
                 </Button>
               </DialogTrigger>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>File Monthly Return</DialogTitle>
                 </DialogHeader>
                 <div className="py-6 text-center text-muted-foreground">
                    April 2026 returns are not yet due (Window opens April 28th).
                 </div>
               </DialogContent>
             </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
