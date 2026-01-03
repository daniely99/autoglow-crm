import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const seedClients = [
  {
    name: "Marcus Chen",
    phone: "(555) 123-4567",
    email: "marcus@email.com",
    vehicle_details: "2023 Porsche 911 GT3",
    last_service_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 month ago
    total_revenue: 4250,
    status: "Reactivated",
  },
  {
    name: "Sarah Williams",
    phone: "(555) 234-5678",
    email: "sarah@email.com",
    vehicle_details: "2022 BMW M4 Competition",
    last_service_date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 months ago
    total_revenue: 2800,
    status: "Active",
  },
  {
    name: "David Rodriguez",
    phone: "(555) 345-6789",
    email: "david@email.com",
    vehicle_details: "2024 Tesla Model S Plaid",
    last_service_date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 months ago
    total_revenue: 1500,
    status: "At Risk",
  },
  {
    name: "Emily Zhang",
    phone: "(555) 456-7890",
    email: "emily@email.com",
    vehicle_details: "2023 Mercedes AMG GT",
    last_service_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1.5 months ago
    total_revenue: 3600,
    status: "Reactivated",
  },
  {
    name: "James Thompson",
    phone: "(555) 567-8901",
    email: "james@email.com",
    vehicle_details: "2022 Audi RS7",
    last_service_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months ago
    total_revenue: 5200,
    status: "Reactivated",
  },
];

export const useSeedData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if user already has clients
      const { data: existingClients } = await supabase
        .from("clients")
        .select("id")
        .limit(1);

      if (existingClients && existingClients.length > 0) {
        throw new Error("You already have clients. Seed data not needed.");
      }

      // Insert seed clients
      const { data, error } = await supabase
        .from("clients")
        .insert(seedClients.map(client => ({ ...client, user_id: user.id })))
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-stats"] });
      toast({ title: "Demo clients added! 🚗", description: "5 sample clients loaded into your garage" });
    },
    onError: (error) => {
      if (error.message.includes("already have clients")) {
        toast({ title: "Seed not needed", description: error.message });
      } else {
        toast({ title: "Error seeding data", description: error.message, variant: "destructive" });
      }
    },
  });
};
