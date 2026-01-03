import { useState } from "react";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatView } from "@/components/inbox/ChatView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";
import { useMessages, useSendMessage, useRealtimeMessages } from "@/hooks/useMessages";
import { format } from "date-fns";

const Inbox = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedClientId || undefined);
  const sendMessage = useSendMessage();

  // Enable realtime updates
  useRealtimeMessages(selectedClientId || undefined);

  const selectedClient = clients?.find((c) => c.id === selectedClientId);

  // Group messages by client to show conversations
  const conversations = clients?.map((client) => ({
    id: client.id,
    clientName: client.name,
    clientVehicle: client.vehicle_details || "No vehicle",
    lastMessage: "Tap to start conversation",
    timestamp: format(new Date(client.created_at), "MMM d"),
    unread: false,
  })) || [];

  const handleSendMessage = async (content: string) => {
    if (!selectedClientId) return;
    await sendMessage.mutateAsync({ client_id: selectedClientId, content });
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-6rem)] flex flex-col">
        {/* Mobile: Show list or chat */}
        <div className="md:hidden flex-1 flex flex-col">
          {selectedClientId ? (
            <div className="flex-1 flex flex-col animate-slide-in">
              <div className="p-4 border-b border-glass-border flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedClientId(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-display font-semibold">Messages</h2>
              </div>
              <div className="flex-1">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <ChatView
                    clientName={selectedClient?.name || ""}
                    clientVehicle={selectedClient?.vehicle_details || ""}
                    messages={(messages || []).map((m) => ({
                      id: m.id,
                      content: m.content,
                      direction: m.direction,
                      timestamp: format(new Date(m.created_at), "h:mm a"),
                    }))}
                    onSendMessage={handleSendMessage}
                    isSending={sendMessage.isPending}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="p-4 border-b border-glass-border">
                <h1 className="text-2xl font-display font-bold mb-1">Inbox</h1>
                <p className="text-muted-foreground text-sm">
                  {conversations.length} conversations
                </p>
              </div>
              
              {clientsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conv, index) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedClientId(conv.id)}
                      className={cn(
                        "p-4 border-b border-glass-border cursor-pointer transition-all duration-200 animate-slide-in hover:bg-secondary/50"
                      )}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-sm">{conv.clientName}</h4>
                        <span className="text-[10px] text-muted-foreground">{conv.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conv.clientVehicle}</p>
                      <p className="text-sm text-foreground/80 truncate">{conv.lastMessage}</p>
                    </div>
                  ))}
                  
                  {conversations.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No clients yet. Add clients to start conversations.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop: Split view */}
        <div className="hidden md:flex flex-1">
          <div className="w-80 border-r border-glass-border flex flex-col">
            <div className="p-4 border-b border-glass-border">
              <h1 className="text-xl font-display font-bold mb-1">Inbox</h1>
              <p className="text-muted-foreground text-sm">
                {conversations.length} conversations
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv, index) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedClientId(conv.id)}
                  className={cn(
                    "p-4 border-b border-glass-border cursor-pointer transition-all duration-200",
                    selectedClientId === conv.id 
                      ? "bg-primary/10 border-l-2 border-l-primary" 
                      : "hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-sm">{conv.clientName}</h4>
                    <span className="text-[10px] text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{conv.clientVehicle}</p>
                  <p className="text-sm text-foreground/80 truncate">{conv.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            {selectedClientId ? (
              messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <ChatView
                  clientName={selectedClient?.name || ""}
                  clientVehicle={selectedClient?.vehicle_details || ""}
                  messages={(messages || []).map((m) => ({
                    id: m.id,
                    content: m.content,
                    direction: m.direction,
                    timestamp: format(new Date(m.created_at), "h:mm a"),
                  }))}
                  onSendMessage={handleSendMessage}
                  isSending={sendMessage.isPending}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Inbox;
