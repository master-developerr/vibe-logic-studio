import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, MessageSquare, MoreHorizontal, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/admin/Avatar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DrawerTabId, DrawerStudentRow, DRAWER_TABS } from "./types";
import { DrawerSidebar } from "./DrawerSidebar";
import { OverviewTab } from "./OverviewTab";
import { EnrollmentTab } from "./EnrollmentTab";
import { LearningTab } from "./LearningTab";
import { PaymentsTab } from "./PaymentsTab";
import { NotesTab } from "./NotesTab";
import { InsightsTab } from "./InsightsTab";
import { SecurityTab } from "./SecurityTab";
import { AuditTab } from "./AuditTab";

// Tab Components (to be implemented)
function ComingSoonTab({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center mb-4">
        <AlertCircle className="w-5 h-5 text-text-muted" />
      </div>
      <h3 className="text-[14px] font-bold text-text-primary mb-1">{name}</h3>
      <p className="text-[12px] text-text-muted max-w-sm">
        This section is currently being developed and will be available soon.
      </p>
    </div>
  );
}

export function StudentDrawer({
  student,
  onClose,
}: {
  student: DrawerStudentRow;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DrawerTabId>("Overview");

  // For demonstration, use basic component map
  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab student={student} />;
      case "Enrollment":
        return <EnrollmentTab student={student} />;
      case "Learning":
        return <LearningTab student={student} />;
      case "Payments":
        return <PaymentsTab student={student} />;
      case "Notes":
        return <NotesTab student={student} />;
      case "Insights":
        return <InsightsTab student={student} />;
      case "Security":
        return <SecurityTab student={student} />;
      case "Audit":
        return <AuditTab student={student} />;
      default:
        return <ComingSoonTab name={activeTab} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer Panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="ml-auto relative w-full max-w-5xl h-full bg-surface border-l border-border flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-surface shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Avatar name={student.name} url={student.avatarUrl} size={14} />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-bold text-text-primary tracking-tight">
                  {student.name}
                </h2>
                <StatusBadge status={student.accountStatus || "active"} />
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-[13px] text-text-muted">
                <span>{student.email}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="uppercase tracking-wide font-semibold text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {student.role || "Student"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 border border-border rounded-lg text-[13px] font-semibold text-text-secondary hover:bg-background hover:text-text-primary transition-all flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Profile
            </button>
            <button className="h-9 px-4 bg-primary text-white rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition-all flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Message
            </button>
            <button className="w-9 h-9 border border-border rounded-lg text-text-secondary hover:bg-background hover:text-text-primary transition-all flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:bg-background hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          <DrawerSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex-1 bg-background overflow-y-auto relative">
            <div className="p-8 max-w-3xl">
              {renderTabContent()}
            </div>
          </div>
        </div>

      </motion.aside>
    </motion.div>
  );
}
