import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterStep1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/register/step2");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              AAROGYA <span className="text-primary">NETRA</span>
            </span>
          </div>
        </div>

        <div className="card-clinical overflow-hidden">
          {/* Progress */}
          <div className="border-b border-border bg-secondary px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-primary">Step 1 of 2</span>
              <span className="text-muted-foreground">Hospital Account</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted">
              <div className="h-1.5 w-1/2 rounded-full gradient-teal" />
            </div>
          </div>

          <div className="p-6">
            <h2 className="mb-1 text-lg font-semibold text-foreground">Hospital Account</h2>
            <p className="mb-6 text-sm text-muted-foreground">Create your login credentials</p>

            <form onSubmit={handleNext} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-email">Hospital Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="admin@hospital.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Create a strong password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep1;
