import { useState } from "react";
import { Search, Filter, SortDesc } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientCard, Client } from "@/components/clients/ClientCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockClients: Client[] = [
  {
    id: "1",
    name: "Marcus Chen",
    phone: "(555) 123-4567",
    email: "marcus@email.com",
    vehicle: "Porsche 911 GT3",
    lastServiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    totalLTV: 4250,
  },
  {
    id: "2",
    name: "Sarah Williams",
    phone: "(555) 234-5678",
    email: "sarah@email.com",
    vehicle: "BMW M4 Competition",
    lastServiceDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
    totalLTV: 2800,
  },
  {
    id: "3",
    name: "David Rodriguez",
    phone: "(555) 345-6789",
    email: "david@email.com",
    vehicle: "Tesla Model S Plaid",
    lastServiceDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 7 months ago
    totalLTV: 1500,
  },
  {
    id: "4",
    name: "Emily Zhang",
    phone: "(555) 456-7890",
    email: "emily@email.com",
    vehicle: "Mercedes AMG GT",
    lastServiceDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 1.5 months ago
    totalLTV: 3600,
  },
  {
    id: "5",
    name: "James Thompson",
    phone: "(555) 567-8901",
    email: "james@email.com",
    vehicle: "Audi RS7",
    lastServiceDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
    totalLTV: 5200,
  },
  {
    id: "6",
    name: "Lisa Park",
    phone: "(555) 678-9012",
    email: "lisa@email.com",
    vehicle: "Lamborghini Huracán",
    lastServiceDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
    totalLTV: 8500,
  },
];

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-4 pt-6">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-display font-bold mb-1">Clients</h1>
          <p className="text-muted-foreground text-sm">
            Your garage of {mockClients.length} vehicles
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients or vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-glass-border"
            />
          </div>
          <Button variant="glass" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon">
            <SortDesc className="w-4 h-4" />
          </Button>
        </div>

        {/* Client List */}
        <div className="space-y-3">
          {filteredClients.map((client, index) => (
            <div key={client.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <ClientCard client={client} />
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No clients found</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Clients;
