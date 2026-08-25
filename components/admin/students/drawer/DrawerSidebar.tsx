import React from "react";
import { cn } from "@/lib/utils";
import { DrawerTabId, DRAWER_TABS } from "./types";
import { 
  User, BookOpen, GraduationCap, Calendar, 
  FileText, CreditCard, Award, MessageSquare, 
  StickyNote, Lightbulb, Shield, Activity, 
  History 
} from "lucide-react";

const TAB_ICONS: Record<DrawerTabId, React.ElementType> = {
  Overview: User,
  Enrollment: BookOpen,
  Learning: GraduationCap,
  Attendance: Calendar,
  Assignments: FileText,
  Payments: CreditCard,
  Certificates: Award,
  Communication: MessageSquare,
  Notes: StickyNote,
  Insights: Lightbulb,
  Security: Shield,
  Activity: Activity,
  Audit: History,
};

type DrawerSidebarProps = {
  activeTab: DrawerTabId;
  onTabChange: (tab: DrawerTabId) => void;
};

export function DrawerSidebar({ activeTab, onTabChange }: DrawerSidebarProps) {
  return (
    <div className="w-56 shrink-0 border-r border-border bg-surface flex flex-col h-full overflow-y-auto">
      <div className="p-4 flex-1">
        <div className="space-y-0.5">
          {DRAWER_TABS.map((tab) => {
            const Icon = TAB_ICONS[tab];
            const isActive = activeTab === tab;
            
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                )}
              >
                <Icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-primary" : "text-text-muted group-hover:text-text-secondary"
                )} />
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
