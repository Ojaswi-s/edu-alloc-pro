import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function Login() {
  const { loginWithPassword, verifyOtp, signup } = useAuth();
  const navigate = useNavigate();
  
  const [view, setView] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<"password" | "otp">("password");
  
  const [email, setEmail] = useState("collector@edubeacon.gov");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState("teacher");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter credentials");
    
    setLoading(true);
    if (view === "signin") {
      const success = await loginWithPassword(email, password);
      if (success) {
        setStep("otp");
        toast.success("OTP sent", { description: "Use 123456 for demo purposes." });
      } else {
        toast.error("Invalid credentials");
      }
    } else {
      const success = await signup(email, password, role);
      if (success) {
        toast.success("Account created successfully");
        navigate("/");
      }
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("OTP must be 6 digits");
    
    setLoading(true);
    const success = await verifyOtp(email, otp);
    setLoading(false);
    
    if (success) {
      navigate("/");
    } else {
      toast.error("Invalid OTP. Try 123456.");
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side (Branding) */}
      <div className="hidden lg:flex w-1/2 bg-[#1b6df3] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="size-10 rounded-lg bg-white/20 grid place-items-center">
              <span className="font-bold text-white text-sm">EA</span>
            </div>
            <div>
              <div className="font-bold text-xl leading-tight">EduAllocPro</div>
              <div className="text-xs text-white/70 uppercase tracking-widest font-semibold">NANDURBAR DISTRICT</div>
            </div>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-8">
            School intelligence,<br />at officer scale.
          </h1>
          <p className="text-xl text-white/80 max-w-xl mb-12 leading-relaxed">
            847 schools. 200 vacancies. One operating system to deploy the right teacher to the right village — backed by UDISE+, road routing, and field verification.
          </p>

          <div className="flex gap-4">
            <div className="bg-white/10 p-4 rounded-xl flex-1 backdrop-blur-sm border border-white/10">
              <ShieldCheck className="size-5 mb-2 opacity-80" />
              <div className="text-sm font-medium">Collector view</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl flex-1 backdrop-blur-sm border border-white/10">
              <ShieldCheck className="size-5 mb-2 opacity-80" />
              <div className="text-sm font-medium">School view</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl flex-1 backdrop-blur-sm border border-white/10">
              <ShieldCheck className="size-5 mb-2 opacity-80" />
              <div className="text-sm font-medium">Teacher view</div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-white/60">
          v1.0 • Apr 2026
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full lg:w-1/2 bg-[#0B0F19] text-white p-6 lg:p-16 flex flex-col justify-center relative">
        <div className="max-w-md w-full mx-auto">
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Welcome to EduAllocPro</h2>
            <p className="text-white/60">Sign in to continue to the district command center</p>
          </div>

          <div className="flex bg-[#1A1F2E] p-1 rounded-md mb-8">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-sm transition ${view === "signin" ? "bg-[#1b6df3] text-white" : "text-white/60 hover:text-white"}`}
              onClick={() => { setView("signin"); setStep("password"); }}
            >
              Sign in
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-sm transition ${view === "signup" ? "bg-[#1b6df3] text-white" : "text-white/60 hover:text-white"}`}
              onClick={() => setView("signup")}
            >
              Create account
            </button>
          </div>

          {step === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  className="bg-[#1A1F2E] border-white/10 text-white focus-visible:ring-[#1b6df3]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              {view === "signup" && (
                 <div className="space-y-2">
                   <Label htmlFor="role" className="text-white">Account Type</Label>
                   <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-[#1A1F2E] border-white/10 text-white">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="school">School Admin</SelectItem>
                      <SelectItem value="collector">District Collector</SelectItem>
                    </SelectContent>
                  </Select>
                 </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  className="bg-[#1A1F2E] border-white/10 text-white focus-visible:ring-[#1b6df3]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {view === "signin" && (
                <div className="space-y-3 pt-2 pb-2">
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Quick Demo Accounts</div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEmail("collector@edubeacon.gov")}
                      className="bg-transparent border-white/10 text-white/80 hover:bg-white/5 hover:text-white flex-1 text-xs py-1 h-8"
                    >
                      Collector
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEmail("school@edubeacon.gov")}
                      className="bg-transparent border-white/10 text-white/80 hover:bg-white/5 hover:text-white flex-1 text-xs py-1 h-8"
                    >
                      School
                    </Button>
                     <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEmail("teacher@edubeacon.gov")}
                      className="bg-transparent border-white/10 text-white/80 hover:bg-white/5 hover:text-white flex-1 text-xs py-1 h-8"
                    >
                      Teacher
                    </Button>
                  </div>
                </div>
              )}
              
              <Button type="submit" disabled={loading} className="w-full bg-[#1b6df3] hover:bg-[#1b6df3]/90 text-white font-medium py-6 text-base mt-2">
                {loading ? "Processing..." : view === "signin" ? "Sign in" : "Create Account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="space-y-2">
                 <Label htmlFor="otp" className="text-white">Enter OTP sent to your email</Label>
                 <Input 
                   id="otp" 
                   type="text"
                   maxLength={6}
                   className="bg-[#1A1F2E] border-white/10 text-white focus-visible:ring-[#1b6df3] text-center tracking-widest text-lg py-6"
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   autoComplete="one-time-code"
                   placeholder="123456"
                 />
               </div>
               
               <div className="flex flex-col gap-3">
                 <Button type="submit" disabled={loading} className="w-full bg-[#1b6df3] hover:bg-[#1b6df3]/90 text-white font-medium py-6 text-base">
                   {loading ? "Verifying..." : "Verify & Sign in"}
                 </Button>
                 <Button type="button" variant="ghost" onClick={() => setStep("password")} className="w-full text-white/60 hover:text-white hover:bg-white/5">
                   Back
                 </Button>
               </div>
            </form>
          )}

          <div className="mt-12 text-center">
            <p className="text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
              By continuing you agree to district data-handling policies under the Maharashtra Right to Education Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
