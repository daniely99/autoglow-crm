import { useState } from "react";
import { Send, Calendar, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  direction: "inbound" | "outbound";
  timestamp: string;
}

interface ChatViewProps {
  clientName: string;
  clientVehicle: string;
  messages: Message[];
  onSendMessage?: (content: string) => Promise<void>;
  isSending?: boolean;
}

export const ChatView = ({ 
  clientName, 
  clientVehicle, 
  messages, 
  onSendMessage,
  isSending 
}: ChatViewProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !onSendMessage) return;
    
    await onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border">
        <div>
          <h3 className="font-semibold">{clientName}</h3>
          <p className="text-xs text-muted-foreground">{clientVehicle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="glass" size="sm">
            <Calendar className="w-4 h-4 mr-1.5" />
            Book
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>No messages yet. Send the first message!</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={cn(
              "flex animate-fade-in",
              msg.direction === "outbound" ? "justify-end" : "justify-start"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div
              className={cn(
                "max-w-[80%] px-4 py-2.5 rounded-2xl",
                msg.direction === "outbound"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-foreground rounded-bl-md"
              )}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={cn(
                "text-[10px] mt-1",
                msg.direction === "outbound" 
                  ? "text-primary-foreground/70" 
                  : "text-muted-foreground"
              )}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-glass-border">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-secondary border-glass-border"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="neon"
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export type { Message };
