import { DollarSign, Zap, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActionsFAB } from "@/components/dashboard/QuickActionsFAB";

const Dashboard = () => {
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <MetricCard
            title="Revenue Recovered"
            value="$12,450"
            subtitle="This month from reactivations"
            icon={DollarSign}
            trend="up"
            trendValue="23%"
            variant="neon"
          />
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Active Loops"
              value="5"
              subtitle="Running now"
              icon={Zap}
              variant="accent"
            />
            <MetricCard
              title="Next Appt"
              value="10am"
              subtitle="Tesla Model S"
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
