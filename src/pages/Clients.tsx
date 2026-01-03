import { useState } from "react";
import { Search, Filter, SortDesc, Loader2, UserPlus, Upload } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientCard } from "@/components/clients/ClientCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClients } from "@/hooks/useClients";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ImportClientsDialog } from "@/components/clients/ImportClientsDialog";

const Clients = () => {
  const { data: clients, isLoading } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const filteredClients = (clients || []).filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.vehicle_details || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-4 pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-display font-bold mb-1">Clients</h1>
            <p className="text-muted-foreground text-sm">
              Your garage of {clients?.length || 0} vehicles
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-1" />
              Import CSV
            </Button>
            <Button variant="neon" size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Client List */}
        {!isLoading && (
          <div className="space-y-3">
            {filteredClients.map((client, index) => (
              <div key={client.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ClientCard 
                  client={{
                    id: client.id,
                    name: client.name,
                    phone: client.phone || "",
                    email: client.email || "",
                    vehicle: client.vehicle_details || "No vehicle",
                    lastServiceDate: client.last_service_date ? new Date(client.last_service_date) : new Date(),
                    totalLTV: Number(client.total_revenue) || 0,
                  }} 
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No clients found" : "No clients yet. Add your first client!"}
            </p>
          </div>
        )}
      </div>

      <AddClientDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <ImportClientsDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} />
    </AppLayout>
  );
};

export default Clients;
