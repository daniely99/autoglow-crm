import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateClient } from "@/hooks/useClients";
import { cn } from "@/lib/utils";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  vehicle_details: z.string().min(1, "Vehicle details are required"),
  last_service_date: z.date().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddClientDialog = ({ open, onOpenChange }: AddClientDialogProps) => {
  const createClient = useCreateClient();
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      vehicle_details: "",
      last_service_date: undefined,
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    await createClient.mutateAsync({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      vehicle_details: data.vehicle_details,
      last_service_date: data.last_service_date 
        ? format(data.last_service_date, "yyyy-MM-dd") 
        : null,
      total_revenue: 0,
      status: "Active",
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-[hsl(222,47%,12%/0.95)] to-[hsl(222,47%,8%/0.95)] backdrop-blur-xl border-[hsl(186,100%,50%/0.3)] sm:max-w-md shadow-[0_0_40px_hsl(186,100%,50%/0.15)]">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground text-xl">
            Add New Client
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Client Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-secondary/50 border-[hsl(186,100%,50%/0.2)] focus:border-[hsl(186,100%,50%/0.5)] text-foreground"
                      placeholder="John Smith"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-secondary/50 border-[hsl(186,100%,50%/0.2)] focus:border-[hsl(186,100%,50%/0.5)] text-foreground"
                      placeholder="(555) 000-0000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-secondary/50 border-[hsl(186,100%,50%/0.2)] focus:border-[hsl(186,100%,50%/0.5)] text-foreground"
                      placeholder="john@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicle_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Vehicle Details *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-secondary/50 border-[hsl(186,100%,50%/0.2)] focus:border-[hsl(186,100%,50%/0.5)] text-foreground"
                      placeholder="2023 Audi R8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="last_service_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-muted-foreground">Last Service Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-secondary/50 border-[hsl(186,100%,50%/0.2)] hover:bg-secondary/70",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-glass-border" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 border-glass-border hover:bg-secondary/50"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="neon" 
                className="flex-1"
                disabled={createClient.isPending}
              >
                {createClient.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Client
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
