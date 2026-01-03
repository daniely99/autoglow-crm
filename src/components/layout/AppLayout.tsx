import { ReactNode } from "react";
import { MobileNav } from "./MobileNav";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-sunset-orange/5 rounded-full blur-3xl" />
      </div>
      
      {/* Main content */}
      <main className="relative pb-24 min-h-screen">
        {children}
      </main>
      
      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
};
