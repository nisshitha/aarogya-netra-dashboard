import { MessageSquare } from "lucide-react";

const FeedbackStream = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feedback Stream</h1>
        <p className="text-sm text-muted-foreground">Real-time patient feedback from all channels.</p>
      </div>

      <div className="card-clinical overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Message</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sentiment</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Department</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="empty-state py-16">
                    <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">No feedback received yet</p>
                    <p className="text-sm max-w-sm text-center">
                      Feedback will appear here in real time once connected to patient channels.
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
          <span className="text-muted-foreground">Sources:</span>
          <span className="badge-whatsapp">WhatsApp</span>
          <span className="badge-email">Email</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Sentiments:</span>
          <span className="badge-positive">Positive</span>
          <span className="badge-neutral">Neutral</span>
          <span className="badge-negative">Negative</span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackStream;
