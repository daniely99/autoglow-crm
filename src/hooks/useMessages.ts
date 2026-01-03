import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface Message {
  id: string;
  client_id: string;
  user_id: string;
  content: string;
  direction: "inbound" | "outbound";
  status: string;
  created_at: string;
}

export interface ConversationWithClient {
  client_id: string;
  client_name: string;
  client_vehicle: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useMessages = (clientId?: string) => {
  return useQuery({
    queryKey: ["messages", clientId],
    queryFn: async () => {
      let query = supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (clientId) {
        query = query.eq("client_id", clientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!clientId,
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      // Get all messages with client info
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("*, clients(name, vehicle_details)")
        .order("created_at", { ascending: false });

      if (messagesError) throw messagesError;

      // Group by client
      const conversationMap = new Map<string, ConversationWithClient>();
      
      for (const msg of messages || []) {
        if (!conversationMap.has(msg.client_id)) {
          conversationMap.set(msg.client_id, {
            client_id: msg.client_id,
            client_name: (msg.clients as any)?.name || "Unknown",
            client_vehicle: (msg.clients as any)?.vehicle_details,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: msg.direction === "inbound" && msg.status !== "read" ? 1 : 0,
          });
        } else if (msg.direction === "inbound" && msg.status !== "read") {
          const conv = conversationMap.get(msg.client_id)!;
          conv.unread_count++;
        }
      }

      return Array.from(conversationMap.values());
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ client_id, content }: { client_id: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          client_id,
          user_id: user.id,
          content,
          direction: "outbound",
          status: "sent",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.client_id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
    },
  });
};

export const useRealtimeMessages = (clientId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Realtime message update:", payload);
          queryClient.invalidateQueries({ queryKey: ["messages", clientId] });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, queryClient]);
};
