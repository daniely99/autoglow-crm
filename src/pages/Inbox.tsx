import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConversationList, Conversation } from "@/components/inbox/ConversationList";
import { ChatView, Message } from "@/components/inbox/ChatView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockConversations: Conversation[] = [
  {
    id: "1",
    clientName: "Marcus Chen",
    clientVehicle: "Porsche 911 GT3",
    lastMessage: "Yes! Book me in for Saturday",
    timestamp: "2 min",
    unread: true,
  },
  {
    id: "2",
    clientName: "Sarah Williams",
    clientVehicle: "BMW M4 Competition",
    lastMessage: "What packages do you offer?",
    timestamp: "2 hr",
    unread: true,
  },
  {
    id: "3",
    clientName: "David Rodriguez",
    clientVehicle: "Tesla Model S Plaid",
    lastMessage: "Thanks for the reminder!",
    timestamp: "1 day",
    unread: false,
  },
  {
    id: "4",
    clientName: "Emily Zhang",
    clientVehicle: "Mercedes AMG GT",
    lastMessage: "Perfect, see you then",
    timestamp: "2 days",
    unread: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", content: "Hey Marcus, your Porsche is due for a glow up. Want 20% off?", direction: "outbound", timestamp: "10:30 AM" },
    { id: "2", content: "Oh nice! What does that include?", direction: "inbound", timestamp: "10:45 AM" },
    { id: "3", content: "Full exterior detail, ceramic boost, and interior deep clean. Usually $450, yours for $360.", direction: "outbound", timestamp: "10:47 AM" },
    { id: "4", content: "Yes! Book me in for Saturday", direction: "inbound", timestamp: "10:52 AM" },
  ],
  "2": [
    { id: "1", content: "Hi Sarah! Time for a seasonal polish on your M4. 15% off this week.", direction: "outbound", timestamp: "Yesterday" },
    { id: "2", content: "What packages do you offer?", direction: "inbound", timestamp: "2 hours ago" },
  ],
  "3": [
    { id: "1", content: "Hey David, haven't seen your Model S in a while. Ready for a refresh?", direction: "outbound", timestamp: "2 days ago" },
    { id: "2", content: "Thanks for the reminder!", direction: "inbound", timestamp: "1 day ago" },
  ],
  "4": [
    { id: "1", content: "Your AMG GT is booked for Thursday at 2pm. See you then! 🚗", direction: "outbound", timestamp: "3 days ago" },
    { id: "2", content: "Perfect, see you then", direction: "inbound", timestamp: "2 days ago" },
  ],
};

const Inbox = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const selectedConv = mockConversations.find((c) => c.id === selectedConversation);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-6rem)] flex flex-col">
        {/* Mobile: Show list or chat */}
        <div className="md:hidden flex-1 flex flex-col">
          {selectedConversation ? (
            <div className="flex-1 flex flex-col animate-slide-in">
              <div className="p-4 border-b border-glass-border flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-display font-semibold">Messages</h2>
              </div>
              <div className="flex-1">
                <ChatView
                  clientName={selectedConv?.clientName || ""}
                  clientVehicle={selectedConv?.clientVehicle || ""}
                  messages={mockMessages[selectedConversation] || []}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="p-4 border-b border-glass-border">
                <h1 className="text-2xl font-display font-bold mb-1">Inbox</h1>
                <p className="text-muted-foreground text-sm">
                  {mockConversations.filter((c) => c.unread).length} unread messages
                </p>
              </div>
              <ConversationList
                conversations={mockConversations}
                selectedId={selectedConversation}
                onSelect={setSelectedConversation}
              />
            </div>
          )}
        </div>

        {/* Desktop: Split view */}
        <div className="hidden md:flex flex-1">
          <div className="w-80 border-r border-glass-border flex flex-col">
            <div className="p-4 border-b border-glass-border">
              <h1 className="text-xl font-display font-bold mb-1">Inbox</h1>
              <p className="text-muted-foreground text-sm">
                {mockConversations.filter((c) => c.unread).length} unread
              </p>
            </div>
            <ConversationList
              conversations={mockConversations}
              selectedId={selectedConversation}
              onSelect={setSelectedConversation}
            />
          </div>
          <div className="flex-1">
            {selectedConversation ? (
              <ChatView
                clientName={selectedConv?.clientName || ""}
                clientVehicle={selectedConv?.clientVehicle || ""}
                messages={mockMessages[selectedConversation] || []}
              />
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
