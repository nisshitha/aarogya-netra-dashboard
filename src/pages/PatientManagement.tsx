import { useState } from "react";
import { UserPlus, Search, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PatientManagement = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Patient Added", description: "Patient registered successfully." });
    (e.target as HTMLFormElement).reset();
    setDialogOpen(false);
  };

  const statCards = [
    { label: "Total Patients", value: 0, color: "text-foreground" },
    { label: "Active", value: 0, color: "text-emerald-600" },
    { label: "Under Treatment", value: 0, color: "text-amber-600" },
    { label: "Discharged", value: 0, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Management</h1>
          <p className="text-sm text-muted-foreground">Manage patient records and guardian information</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input placeholder="Full name" required />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" placeholder="Age" min={0} required />
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
                <Input type="tel" placeholder="+91 98765 43210" required />
              </div>
              <div className="space-y-2">
                <Label>Guardian Name</Label>
                <Input placeholder="Guardian full name" />
              </div>
              <div className="space-y-2">
                <Label>Guardian Phone</Label>
                <Input type="tel" placeholder="+91 98765 43210" />
              </div>
              <div className="sm:col-span-2 flex justify-end pt-2">
                <Button type="submit" className="gap-2">
                  <UserPlus className="h-4 w-4" /> Add Patient
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="card-clinical p-5">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="card-clinical p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients, phone, or guardian..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="treatment">Under Treatment</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-clinical overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guardian</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="empty-state py-16">
                    <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">No patients added yet</p>
                    <p className="text-sm">Click "Add Patient" to register the first patient</p>
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
