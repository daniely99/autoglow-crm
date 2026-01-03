import { MessageCircle, Calendar, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "sms_reply" | "appointment" | "campaign_trigger";
  title: string;
  description: string;
  timestamp: string;
}

const activityIcons = {
  sms_reply: MessageCircle,
  appointment: Calendar,
  campaign_trigger: Sparkles,
};

const activityColors = {
  sms_reply: "text-primary bg-primary/10",
  appointment: "text-status-active bg-status-active/10",
  campaign_trigger: "text-accent bg-accent/10",
};

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "sms_reply",
    title: "Marcus Chen replied",
    description: '"Yes! Book me in for Saturday"',
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "campaign_trigger",
    title: "Ceramic Boost triggered",
    description: "Sent to 3 clients who haven't visited in 6mo",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    type: "appointment",
    title: "Appointment confirmed",
    description: "Tesla Model S - Full Detail @ 10am",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "sms_reply",
    title: "Sarah Williams replied",
    description: '"What packages do you offer?"',
    timestamp: "2 hours ago",
  },
];

export const ActivityFeed = () => {
  return (
    <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
          Recent Activity
        </h3>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <div className="space-y-3">
        {mockActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <div 
              key={activity.id}
              className="flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200 cursor-pointer animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn("p-2 rounded-lg h-fit", activityColors[activity.type])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {activity.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
