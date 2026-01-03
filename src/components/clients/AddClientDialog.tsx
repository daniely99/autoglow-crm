import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateClient } from "@/hooks/useClients";
import { Loader2 } from "lucide-react";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddClientDialog = ({ open, onOpenChange }: AddClientDialogProps) => {
  const createClient = useCreateClient();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle_details: "",
    last_service_date: "",
    total_revenue: 0,
    status: "Active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClient.mutateAsync({
      ...formData,
      last_service_date: formData.last_service_date || null,
    });
    setFormData({
      name: "",
      phone: "",
      email: "",
      vehicle_details: "",
      last_service_date: "",
      total_revenue: 0,
      status: "Active",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card-elevated border-glass-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Client</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm text-muted-foreground">
              Client Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5 bg-secondary border-glass-border"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone" className="text-sm text-muted-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5 bg-secondary border-glass-border"
                placeholder="(555) 000-0000"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5 bg-secondary border-glass-border"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="vehicle" className="text-sm text-muted-foreground">
              Vehicle Details
            </Label>
            <Input
              id="vehicle"
              value={formData.vehicle_details}
              onChange={(e) => setFormData({ ...formData, vehicle_details: e.target.value })}
              className="mt-1.5 bg-secondary border-glass-border"
              placeholder="2023 Porsche 911"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="lastService" className="text-sm text-muted-foreground">
                Last Service Date
              </Label>
              <Input
                id="lastService"
                type="date"
                value={formData.last_service_date}
                onChange={(e) => setFormData({ ...formData, last_service_date: e.target.value })}
                className="mt-1.5 bg-secondary border-glass-border"
              />
            </div>
            <div>
              <Label htmlFor="revenue" className="text-sm text-muted-foreground">
                Total Revenue ($)
              </Label>
              <Input
                id="revenue"
                type="number"
                value={formData.total_revenue}
                onChange={(e) => setFormData({ ...formData, total_revenue: Number(e.target.value) })}
                className="mt-1.5 bg-secondary border-glass-border"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="neon" 
              className="flex-1"
              disabled={createClient.isPending}
            >
              {createClient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
