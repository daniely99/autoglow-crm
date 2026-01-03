import { useEffect } from "react";
import { DollarSign, Zap, Calendar, Loader2, Database } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActionsFAB } from "@/components/dashboard/QuickActionsFAB";
import { useClientStats, useClients } from "@/hooks/useClients";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useSeedData } from "@/hooks/useSeedData";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useClientStats();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: campaigns } = useCampaigns();
  const seedData = useSeedData();

  const activeCampaigns = campaigns?.filter(c => c.is_active).length || 0;
  const isEmpty = !clientsLoading && (!clients || clients.length === 0);

  return (
    <AppLayout>
      <div className="p-4 pt-6">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-display font-bold gradient-text mb-1">
            AutoGlow
          </h1>
          <p className="text-muted-foreground text-sm">
            Welcome back to the garage 🚗
          </p>
        </div>

        {/* Empty State - Seed Data Button */}
        {isEmpty && (
          <div className="glass-card p-6 mb-6 text-center animate-fade-in">
            <Database className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
            <h3 className="font-display font-semibold mb-2">Your Garage is Empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Load demo clients to see the app in action
            </p>
            <Button 
              variant="neon" 
              onClick={() => seedData.mutate()}
              disabled={seedData.isPending}
            >
              {seedData.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Load Demo Data
            </Button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <MetricCard
            title="Revenue Recovered"
            value={statsLoading ? "..." : `$${(stats?.reactivatedRevenue || 0).toLocaleString()}`}
            subtitle="From reactivated clients"
            icon={DollarSign}
            trend="up"
            trendValue="23%"
            variant="neon"
          />
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Active Loops"
              value={String(activeCampaigns)}
              subtitle="Running now"
              icon={Zap}
              variant="accent"
            />
            <MetricCard
              title="Clients"
              value={clientsLoading ? "..." : String(clients?.length || 0)}
              subtitle="In your garage"
              icon={Calendar}
            />
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </div>

      {/* Floating Action Button */}
      <QuickActionsFAB />
    </AppLayout>
  );
};

export default Dashboard;
