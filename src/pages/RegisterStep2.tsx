import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Building2, Phone, MapPin, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_DEPARTMENTS = ["OPD", "Billing", "Pharmacy", "Nursing", "Facilities"];
const DEFAULT_SLA: Record<string, number> = {
  OPD: 24,
  Billing: 12,
  Pharmacy: 6,
  Nursing: 18,
  Facilities: 36,
};

const RegisterStep2 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hospitalName, setHospitalName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [customDept, setCustomDept] = useState("");
  const [allDepts, setAllDepts] = useState(DEFAULT_DEPARTMENTS);
  const [slaConfig, setSlaConfig] = useState<Record<string, number>>(DEFAULT_SLA);

  const toggleDept = useCallback((dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  }, []);

  const addCustomDept = () => {
    const trimmed = customDept.trim();
    if (trimmed && !allDepts.includes(trimmed)) {
      setAllDepts((prev) => [...prev, trimmed]);
      setSelectedDepts((prev) => [...prev, trimmed]);
      setSlaConfig((prev) => ({ ...prev, [trimmed]: 24 }));
      setCustomDept("");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Hospital Registered", description: "Welcome to Aarogya Netra!" });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              AAROGYA <span className="text-primary">NETRA</span>
            </span>
          </div>
        </div>

        <div className="card-clinical overflow-hidden">
          <div className="border-b border-border bg-secondary px-6 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-primary">Step 2 of 2</span>
              <span className="text-muted-foreground">Hospital Details</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted">
              <div className="h-1.5 w-full rounded-full gradient-teal" />
            </div>
          </div>

          <form onSubmit={handleRegister} className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-foreground">Hospital Details</h2>

            <div className="space-y-2">
              <Label>Hospital Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="City General Hospital" className="pl-10" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="+91 98765 43210" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="123 Medical Lane, City" className="pl-10" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>

            {/* Departments */}
            <div className="space-y-3">
              <Label>Departments</Label>
              <div className="flex flex-wrap gap-2">
                {allDepts.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => toggleDept(dept)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedDepts.includes(dept)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {dept}
                    {selectedDepts.includes(dept) && <X className="h-3 w-3" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom department"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomDept())}
                  className="text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={addCustomDept}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* SLA Config */}
            {selectedDepts.length > 0 && (
              <div className="space-y-3">
                <Label>SLA Configuration (Hours)</Label>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Department</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">SLA Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDepts.map((dept) => (
                        <tr key={dept} className="border-t border-border">
                          <td className="px-4 py-2.5 font-medium text-foreground">{dept}</td>
                          <td className="px-4 py-2.5">
                            <Input
                              type="number"
                              min={1}
                              className="w-24 h-8 text-sm"
                              value={slaConfig[dept] ?? 24}
                              onChange={(e) =>
                                setSlaConfig((prev) => ({ ...prev, [dept]: Number(e.target.value) }))
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">Register Hospital</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep2;
