import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
interface StartCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StartCampaignDialog = ({ open, onOpenChange }: StartCampaignDialogProps) => {
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);

  // Filter clients that are "at risk" (Yellow/Orange status based on last_service_date)
  const atRiskClients = clients?.filter(client => {
    if (!client.last_service_date) return false;
    const daysSinceService = Math.floor(
      (Date.now() - new Date(client.last_service_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceService >= 90; // 90+ days = at risk
  }) || [];

  const activeCampaigns = campaigns?.filter(c => c.is_active) || [];

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === atRiskClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(atRiskClients.map(c => c.id));
    }
  };

  const handleLaunch = async () => {
    if (!selectedCampaign || selectedClients.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select a campaign and at least one client.",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-campaign', {
        body: {
          campaignId: selectedCampaign,
          clientIds: selectedClients,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to launch campaign");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Invalidate messages query to refresh inbox
      queryClient.invalidateQueries({ queryKey: ["messages"] });

      toast({
        title: "Campaign Launched! 🚀",
        description: `${data.messagesCreated} message${data.messagesCreated !== 1 ? 's' : ''} sent${data.skippedClients > 0 ? `, ${data.skippedClients} skipped (no phone)` : ''}.`,
      });

      // Reset and close
      setSelectedCampaign("");
      setSelectedClients([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Campaign Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-[hsl(222,47%,12%/0.95)] to-[hsl(222,47%,8%/0.95)] backdrop-blur-xl border-[hsl(16,100%,50%/0.3)] sm:max-w-md shadow-[0_0_40px_hsl(16,100%,50%/0.15)]">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Start Campaign
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Campaign Selection */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Select Campaign</Label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="bg-secondary/50 border-[hsl(16,100%,50%/0.2)] focus:border-[hsl(16,100%,50%/0.5)]">
                <SelectValue placeholder={campaignsLoading ? "Loading..." : "Choose a campaign"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-glass-border">
                {activeCampaigns.length === 0 ? (
                  <SelectItem value="none" disabled>No active campaigns</SelectItem>
                ) : (
                  activeCampaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* At Risk Clients */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">At Risk Clients ({atRiskClients.length})</Label>
              {atRiskClients.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto py-1 px-2 text-xs text-primary hover:text-primary/80"
                  onClick={handleSelectAll}
                >
                  {selectedClients.length === atRiskClients.length ? "Deselect All" : "Select All"}
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-[200px] rounded-lg border border-glass-border bg-secondary/30 p-3">
              {clientsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : atRiskClients.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground text-sm">No at-risk clients found</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">Clients with 90+ days since service appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {atRiskClients.map(client => {
                    const daysSince = client.last_service_date 
                      ? Math.floor((Date.now() - new Date(client.last_service_date).getTime()) / (1000 * 60 * 60 * 24))
                      : 0;
                    
                    return (
                      <label
                        key={client.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={() => handleClientToggle(client.id)}
                          className="border-glass-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{client.vehicle_details}</p>
                        </div>
                        <span className={`text-xs font-medium ${daysSince >= 180 ? 'text-destructive' : 'text-status-warning'}`}>
                          {daysSince}d
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 border-glass-border hover:bg-secondary/50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLaunch}
              disabled={isLaunching || !selectedCampaign || selectedClients.length === 0}
              className="flex-1 bg-accent hover:bg-accent/90 text-white shadow-[0_0_20px_hsl(16,100%,50%/0.3)]"
            >
              {isLaunching && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Launch Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
