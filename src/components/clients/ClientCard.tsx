import { Car, Phone, DollarSign, Calendar } from "lucide-react";
import { ClientStatusBadge } from "./ClientStatusBadge";
import { format } from "date-fns";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  lastServiceDate: Date;
  totalLTV: number;
}

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

export const ClientCard = ({ client, onClick }: ClientCardProps) => {
  return (
    <div 
      className="glass-card p-4 cursor-pointer hover:border-primary/30 transition-all duration-200 animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{client.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Phone className="w-3 h-3" />
            {client.phone}
          </p>
        </div>
        <ClientStatusBadge lastServiceDate={client.lastServiceDate} />
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
          <Car className="w-3.5 h-3.5" />
          <span>{client.vehicle}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last: {format(client.lastServiceDate, "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-primary">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{client.totalLTV.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export type { Client };
