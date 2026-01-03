import { useState } from "react";
import { Plus, UserPlus, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const QuickActionsFAB = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: UserPlus, label: "Add Client", color: "bg-primary hover:bg-primary/90" },
    { icon: Zap, label: "Start Campaign", color: "bg-accent hover:bg-accent/90" },
  ];

  return (
    <div className="fixed right-4 bottom-24 z-40">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <div 
            key={action.label}
            className="flex items-center gap-3 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="glass-card px-3 py-1.5 text-sm font-medium whitespace-nowrap">
              {action.label}
            </span>
            <Button 
              size="fab" 
              className={cn(action.color, "shadow-lg")}
              onClick={() => setIsOpen(false)}
            >
              <action.icon className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="fab"
        variant="neon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "transition-transform duration-300",
          isOpen && "rotate-45"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  );
};
