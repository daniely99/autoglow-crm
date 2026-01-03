import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "neon" | "accent";
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
}: MetricCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card p-4 animate-fade-in",
        variant === "neon" && "border-primary/30",
        variant === "accent" && "border-accent/30"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className={cn(
            "p-2 rounded-lg",
            variant === "neon" && "bg-primary/10",
            variant === "accent" && "bg-accent/10",
            variant === "default" && "bg-secondary"
          )}
        >
          <Icon 
            className={cn(
              "w-5 h-5",
              variant === "neon" && "text-primary",
              variant === "accent" && "text-accent",
              variant === "default" && "text-muted-foreground"
            )} 
          />
        </div>
        {trend && trendValue && (
          <span 
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend === "up" && "bg-status-active/20 text-status-active",
              trend === "down" && "bg-status-urgent/20 text-status-urgent",
              trend === "neutral" && "bg-muted text-muted-foreground"
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className={cn(
          "text-2xl font-bold font-display",
          variant === "neon" && "text-primary",
          variant === "accent" && "text-accent"
        )}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
