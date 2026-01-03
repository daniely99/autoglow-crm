import { Building2, Key, CreditCard, Bell, Shield } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {
  return (
    <AppLayout>
      <div className="p-4 pt-6 pb-32">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-display font-bold mb-1">Settings</h1>
          <p className="text-muted-foreground text-sm">
            Configure your AutoGlow experience
          </p>
        </div>

        {/* Business Details */}
        <div className="glass-card p-4 mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display font-semibold">Business Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName" className="text-sm text-muted-foreground">
                Business Name
              </Label>
              <Input
                id="businessName"
                placeholder="Your Detail Shop"
                defaultValue="Elite Auto Detailing"
                className="mt-1.5 bg-secondary border-glass-border"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm text-muted-foreground">
                Business Phone
              </Label>
              <Input
                id="phone"
                placeholder="(555) 000-0000"
                defaultValue="(555) 987-6543"
                className="mt-1.5 bg-secondary border-glass-border"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Business Logo
              </Label>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-primary-foreground">E</span>
                </div>
                <Button variant="glass" size="sm">Upload Logo</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="glass-card p-4 mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10">
              <Key className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display font-semibold">Integrations</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="twilio" className="text-sm text-muted-foreground">
                Twilio API Key
              </Label>
              <Input
                id="twilio"
                type="password"
                placeholder="Enter your Twilio API key..."
                className="mt-1.5 bg-secondary border-glass-border"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Required for SMS automation
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-status-active" />
                <div>
                  <p className="font-medium text-sm">Stripe</p>
                  <p className="text-xs text-muted-foreground">Accept payments</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-4 mb-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-status-warning/10">
              <Bell className="w-5 h-5 text-status-warning" />
            </div>
            <h2 className="font-display font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">SMS Replies</p>
                <p className="text-xs text-muted-foreground">Get notified when clients reply</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Campaign Triggers</p>
                <p className="text-xs text-muted-foreground">Alerts when campaigns fire</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Appointment Reminders</p>
                <p className="text-xs text-muted-foreground">1 hour before appointments</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-status-urgent/10">
              <Shield className="w-5 h-5 text-status-urgent" />
            </div>
            <h2 className="font-display font-semibold">Security</h2>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Enable Two-Factor Auth
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
