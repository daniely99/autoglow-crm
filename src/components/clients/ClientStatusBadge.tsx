import { cn } from "@/lib/utils";

type ClientStatus = "active" | "at_risk" | "lost";

interface ClientStatusBadgeProps {
  lastServiceDate: Date;
}

const getStatus = (lastServiceDate: Date): ClientStatus => {
  const now = new Date();
  const diffMonths = (now.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (diffMonths < 3) return "active";
  if (diffMonths < 6) return "at_risk";
  return "lost";
};

const statusConfig = {
  active: { label: "Active", className: "status-active" },
  at_risk: { label: "At Risk", className: "status-warning" },
  lost: { label: "Urgent", className: "status-urgent" },
};

export const ClientStatusBadge = ({ lastServiceDate }: ClientStatusBadgeProps) => {
  const status = getStatus(lastServiceDate);
  const config = statusConfig[status];

  return (
    <span className={cn("status-badge", config.className)}>
      {config.label}
    </span>
  );
};

export { getStatus };
