import { useState } from "react";
import { UserPlus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const PatientManagement = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Patient Added", description: "Patient registered successfully." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Patient Management</h1>
        <p className="text-sm text-muted-foreground">Register and manage patient records.</p>
      </div>

      {/* Form */}
      <div className="card-clinical p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Add New Patient</h2>
        <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Patient Name</Label>
            <Input placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <Label>Age</Label>
            <Input type="number" placeholder="Age" min={0} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input type="tel" placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label>Guardian Name</Label>
            <Input placeholder="Guardian full name" />
          </div>
          <div className="space-y-2">
            <Label>Guardian Phone</Label>
            <Input type="tel" placeholder="+91 98765 43210" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" className="gap-2">
              <UserPlus className="h-4 w-4" /> Add Patient
            </Button>
          </div>
        </form>
      </div>

      {/* Search + Table */}
      <div className="card-clinical overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guardian</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}>
                  <div className="empty-state py-12">
                    <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">No patients added yet</p>
                    <p className="text-sm">Use the form above to register a patient.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
