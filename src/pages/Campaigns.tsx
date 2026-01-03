import { Plus, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";
import { useCampaigns } from "@/hooks/useCampaigns";

const Campaigns = () => {
  const { data: campaigns, isLoading } = useCampaigns();

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Campaign List */}
        {!isLoading && campaigns && campaigns.length > 0 && (
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <div key={campaign.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <CampaignCard 
                  campaign={{
                    id: campaign.id,
                    name: campaign.name,
                    description: `Trigger after ${campaign.trigger_days_after_service} days`,
                    triggerCondition: `If 'Last Service' > ${campaign.trigger_days_after_service} days`,
                    messageTemplate: campaign.message_template || "No message template",
                    isActive: campaign.is_active,
                    sentCount: 0,
                    responseRate: 0,
                  }} 
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!campaigns || campaigns.length === 0) && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground mb-4">No campaigns yet. Create your first reactivation loop!</p>
            <Button variant="neon">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Campaigns;
