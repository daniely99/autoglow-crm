import { useState, useEffect, useRef } from "react";
import { Plus, UserPlus, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { StartCampaignDialog } from "@/components/dashboard/StartCampaignDialog";

export const QuickActionsFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [startCampaignOpen, setStartCampaignOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAddClient = () => {
    setIsOpen(false);
    setAddClientOpen(true);
  };

  const handleStartCampaign = () => {
    setIsOpen(false);
    setStartCampaignOpen(true);
  };

  const actions = [
    { 
      icon: UserPlus, 
      label: "Add Client", 
      onClick: handleAddClient,
      className: "bg-[hsl(186,100%,50%)] hover:bg-[hsl(186,100%,45%)] text-background shadow-[0_0_20px_hsl(186,100%,50%/0.4)]"
    },
    { 
      icon: Zap, 
      label: "Start Campaign", 
      onClick: handleStartCampaign,
      className: "bg-[hsl(16,100%,50%)] hover:bg-[hsl(16,100%,45%)] text-white shadow-[0_0_20px_hsl(16,100%,50%/0.4)]"
    },
  ];

  return (
    <>
      <div ref={fabRef} className="fixed right-4 bottom-24 z-40">
        {/* Action buttons */}
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col gap-3 mb-3">
              {actions.map((action, index) => (
                <motion.div 
                  key={action.label}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 10, 
                    scale: 0.8,
                    transition: { 
                      delay: (actions.length - 1 - index) * 0.05,
                      duration: 0.15
                    }
                  }}
                  className="flex items-center gap-3 justify-end"
                >
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.08 + 0.1 }
                    }}
                    className="glass-card px-3 py-1.5 text-sm font-medium whitespace-nowrap"
                  >
                    {action.label}
                  </motion.span>
                  <Button 
                    size="fab" 
                    className={action.className}
                    onClick={action.onClick}
                  >
                    <action.icon className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button
            size="fab"
            variant="neon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </Button>
        </motion.div>
      </div>

      {/* Dialogs */}
      <AddClientDialog open={addClientOpen} onOpenChange={setAddClientOpen} />
      <StartCampaignDialog open={startCampaignOpen} onOpenChange={setStartCampaignOpen} />
    </>
  );
};
