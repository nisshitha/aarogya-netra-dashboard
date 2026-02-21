import { FolderOpen } from "lucide-react";

const CaseManagement = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Case Management</h1>
        <p className="text-sm text-muted-foreground">Track and resolve department-level cases with SLA monitoring.</p>
      </div>

      <div className="card-clinical overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Case ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Issue</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">SLA Timer</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6}>
                  <div className="empty-state py-16">
                    <FolderOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">No cases generated yet</p>
                    <p className="text-sm max-w-sm text-center">
                      Cases will appear automatically when negative feedback is detected.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">SLA Status:</span>
          <span className="badge-sla-ok">Within SLA</span>
          <span className="badge-sla-breach">SLA Breached</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Case Status:</span>
          <span className="badge-active">Open</span>
          <span className="badge-treatment">In Progress</span>
          <span className="badge-discharged">Resolved</span>
        </div>
      </div>
    </div>
  );
};

export default CaseManagement;
