import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  clientName: string;
  clientVehicle: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const ConversationList = ({ conversations, selectedId, onSelect }: ConversationListProps) => {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      {conversations.map((conv, index) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            "p-4 border-b border-glass-border cursor-pointer transition-all duration-200 animate-slide-in",
            selectedId === conv.id 
              ? "bg-primary/10 border-l-2 border-l-primary" 
              : "hover:bg-secondary/50",
            conv.unread && "bg-secondary/30"
          )}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">{conv.clientName}</h4>
              {conv.unread && (
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{conv.timestamp}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">{conv.clientVehicle}</p>
          <p className="text-sm text-foreground/80 truncate">{conv.lastMessage}</p>
        </div>
      ))}
    </div>
  );
};

export type { Conversation };
