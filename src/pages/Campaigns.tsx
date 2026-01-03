import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CampaignCard, Campaign } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "The 6-Month Ceramic Boost",
    description: "Reactivate clients who haven't visited in 6 months",
    triggerCondition: "If 'Last Service' > 180 days",
    messageTemplate: "Hey [Name], your [Vehicle] is due for a glow up. Want 20% off your next ceramic coating?",
    isActive: true,
    sentCount: 47,
    responseRate: 32,
  },
  {
    id: "2",
    name: "Post-Detail Follow Up",
    description: "Check in 48 hours after service",
    triggerCondition: "48 hours after service completion",
    messageTemplate: "Hey [Name]! How's your [Vehicle] looking? Any questions about maintaining that shine? 🌟",
    isActive: true,
    sentCount: 124,
    responseRate: 58,
  },
  {
    id: "3",
    name: "Seasonal Polish Reminder",
    description: "Quarterly maintenance reminder",
    triggerCondition: "Every 90 days since last service",
    messageTemplate: "Time for a seasonal polish! Your [Vehicle] deserves some TLC. Book now and save 15%.",
    isActive: false,
    sentCount: 89,
    responseRate: 28,
  },
  {
    id: "4",
    name: "VIP Client Care",
    description: "Special offers for high-value clients",
    triggerCondition: "LTV > $5,000 AND Last Service > 60 days",
    messageTemplate: "Hey [Name], as a VIP client, you get first access to our new graphene coating. Interested?",
    isActive: true,
    sentCount: 12,
    responseRate: 67,
  },
];

const Campaigns = () => {
  return (
    <AppLayout>
      <div className="p-4 pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-display font-bold mb-1">
              Reactivation Engine
            </h1>
            <p className="text-muted-foreground text-sm">
              Automated loops to bring clients back
            </p>
          </div>
          <Button variant="neon" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Loop
          </Button>
        </div>

        {/* Visual Flow */}
        <div className="glass-card p-4 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            How It Works
          </h3>
          <div className="flex items-center justify-between gap-2 text-center">
            <div className="flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                1
              </div>
              <p className="text-xs text-muted-foreground">Client triggers condition</p>
            </div>
            <div className="text-primary">→</div>
            <div className="flex-1">
              <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                2
              </div>
              <p className="text-xs text-muted-foreground">SMS sent automatically</p>
            </div>
            <div className="text-primary">→</div>
            <div className="flex-1">
              <div className="w-10 h-10 rounded-full bg-status-active/20 text-status-active flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                3
              </div>
              <p className="text-xs text-muted-foreground">Client books in Inbox</p>
            </div>
          </div>
        </div>

        {/* Campaign List */}
        <div className="space-y-4">
          {mockCampaigns.map((campaign, index) => (
            <div key={campaign.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <CampaignCard campaign={campaign} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Campaigns;
