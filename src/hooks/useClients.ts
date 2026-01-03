import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  vehicle_details: string | null;
  last_service_date: string | null;
  total_revenue: number;
  status: string;
  created_at: string;
}

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Client[];
    },
  });
};

export const useClientStats = () => {
  return useQuery({
    queryKey: ["client-stats"],
    queryFn: async () => {
      const { data: clients, error } = await supabase
        .from("clients")
        .select("total_revenue, status");

      if (error) throw error;

      const reactivatedRevenue = (clients || [])
        .filter((c) => c.status === "Reactivated")
        .reduce((sum, c) => sum + (Number(c.total_revenue) || 0), 0);

      const totalClients = clients?.length || 0;

      return { reactivatedRevenue, totalClients };
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (client: Omit<Client, "id" | "user_id" | "created_at">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("clients")
        .insert({ ...client, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-stats"] });
      toast({ title: "Client added to the garage! 🚗" });
    },
    onError: (error) => {
      toast({ title: "Error adding client", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-stats"] });
      toast({ title: "Client updated!" });
    },
    onError: (error) => {
      toast({ title: "Error updating client", description: error.message, variant: "destructive" });
    },
  });
};
