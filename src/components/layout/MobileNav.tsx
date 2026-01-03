import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Zap, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Cockpit", path: "/" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: Zap, label: "Engine", path: "/campaigns" },
  { icon: MessageCircle, label: "Inbox", path: "/inbox" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card-elevated border-t border-glass-border rounded-t-2xl safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "animate-scale-in")} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-0.5 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
