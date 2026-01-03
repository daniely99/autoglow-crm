import { Zap, Clock, MessageCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleCampaign } from "@/hooks/useCampaigns";

interface Campaign {
  id: string;
  name: string;
  description: string;
  triggerCondition: string;
  messageTemplate: string;
  isActive: boolean;
  sentCount: number;
  responseRate: number;
}

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const toggleCampaign = useToggleCampaign();

  const handleToggle = () => {
    toggleCampaign.mutate({ id: campaign.id, is_active: !campaign.isActive });
  };

  return (
    <div 
      className={cn(
        "glass-card p-4 animate-fade-in transition-all duration-300",
        campaign.isActive ? "border-primary/30" : "border-glass-border opacity-70"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            campaign.isActive ? "bg-primary/10" : "bg-secondary"
          )}>
            <Zap className={cn(
              "w-4 h-4",
              campaign.isActive ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <h3 className="font-semibold">{campaign.name}</h3>
            <p className="text-xs text-muted-foreground">{campaign.description}</p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={toggleCampaign.isPending}
          className="transition-colors disabled:opacity-50"
        >
          {campaign.isActive ? (
            <ToggleRight className="w-8 h-8 text-primary" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Trigger condition */}
      <div className="bg-secondary/50 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Trigger</span>
        </div>
        <p className="text-sm text-muted-foreground">{campaign.triggerCondition}</p>
      </div>

      {/* Message preview */}
      <div className="bg-secondary/50 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Message</span>
        </div>
        <p className="text-sm text-foreground italic">"{campaign.messageTemplate}"</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Sent: </span>
          <span className="font-semibold">{campaign.sentCount}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Response: </span>
          <span className="font-semibold text-status-active">{campaign.responseRate}%</span>
        </div>
      </div>
    </div>
  );
};

export type { Campaign };
