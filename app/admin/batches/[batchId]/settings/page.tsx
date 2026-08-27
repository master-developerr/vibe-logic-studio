"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import {
  BatchSettingsToolbar,
  BatchSettingsHealthBanner,
  BatchSettingsGeneral,
  BatchSettingsEnrollment,
  BatchSettingsCommunication,
  BatchSettingsResourcesHub,
  BatchSettingsFeatures,
  BatchSettingsDangerZone,
  BatchSettingsSaveBar,
  ArchiveBatchModal,
  DuplicateBatchModal,
  DeleteBatchModal,
} from "@/components/admin/settings";

export default function BatchSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.batchId as any;

  // 1. UNCONDITIONAL CONVEX HOOKS (Strict React Rules of Hooks)
  const queryData = useQuery(api.admin.getBatchSettingsExtended, { batchId });
  const instructors = useQuery(api.admin.getEligibleInstructors);
  const updateSettings = useMutation(api.admin.updateBatchSettingsExtended);
  const archiveBatch = useMutation(api.admin.archiveBatchExtended);
  const duplicateBatch = useMutation(api.admin.duplicateBatchExtended);
  const deleteBatch = useMutation(api.admin.deleteBatchExtended);

  // 2. FORM STATE & MODALS
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    instructorName: "",
    timezone: "Asia/Kolkata (GMT+5:30)",
    startDate: "",
    endDate: "",
    status: "upcoming",
    capacity: 50,
    enrollmentStatus: "Upcoming",
    allowWaitlist: true,
    whatsappLink: "",
    googleMeetLink: "https://meet.google.com/qgz-vibe-studio",
    discordLink: "https://discord.gg/vibelogic-studio",
    notionLink: "https://notion.so/vibelogic-studio",
    extraLinks: [] as Array<{ title: string; url: string }>,
    attendanceEnabled: true,
    assignmentsEnabled: true,
    certificatesEnabled: true,
    communityEnabled: true,
    aiTutorEnabled: true,
    sandboxEnabled: false,
    isArchived: false,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 3. SYNC INITIAL BACKEND DATA
  const syncFromData = useCallback(() => {
    if (!queryData?.settings) return;
    const s = queryData.settings;
    const formatDate = (timestamp: number) => {
      if (!timestamp) return "";
      return new Date(timestamp).toISOString().split("T")[0];
    };

    setFormState({
      title: s.title || "",
      description: s.description || "",
      instructorName: s.instructorName || "",
      timezone: s.timezone || "Asia/Kolkata (GMT+5:30)",
      startDate: formatDate(s.startDate),
      endDate: formatDate(s.endDate),
      status: s.status || "upcoming",
      capacity: s.capacity || 50,
      enrollmentStatus: s.enrollmentStatus || "Upcoming",
      allowWaitlist: s.allowWaitlist !== undefined ? s.allowWaitlist : true,
      whatsappLink: s.whatsappLink || "",
      googleMeetLink: s.googleMeetLink || "https://meet.google.com/qgz-vibe-studio",
      discordLink: s.discordLink || "https://discord.gg/vibelogic-studio",
      notionLink: s.notionLink || "https://notion.so/vibelogic-studio",
      extraLinks: s.extraLinks || [],
      attendanceEnabled:
        s.attendanceEnabled !== undefined ? s.attendanceEnabled : true,
      assignmentsEnabled:
        s.assignmentsEnabled !== undefined ? s.assignmentsEnabled : true,
      certificatesEnabled:
        s.certificatesEnabled !== undefined ? s.certificatesEnabled : true,
      communityEnabled:
        s.communityEnabled !== undefined ? s.communityEnabled : true,
      aiTutorEnabled:
        s.aiTutorEnabled !== undefined ? s.aiTutorEnabled : true,
      sandboxEnabled:
        s.sandboxEnabled !== undefined ? s.sandboxEnabled : false,
      isArchived: s.isArchived || false,
    });
    setIsDirty(false);
  }, [queryData]);

  useEffect(() => {
    if (!isDirty && queryData?.settings) {
      syncFromData();
    }
  }, [queryData, isDirty, syncFromData]);

  // 4. FIELD CHANGE HANDLERS
  const handleFieldChange = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleReset = () => {
    syncFromData();
    setIsDirty(false);
  };

  // 5. SAVE MUTATION HANDLER
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const parseTimestamp = (dateStr: string, fallback: number) => {
        if (!dateStr) return fallback;
        const ts = new Date(dateStr).getTime();
        return isNaN(ts) ? fallback : ts;
      };

      await updateSettings({
        batchId,
        title: formState.title,
        description: formState.description,
        instructorName: formState.instructorName,
        timezone: formState.timezone,
        startDate: parseTimestamp(
          formState.startDate,
          queryData?.settings.startDate || Date.now()
        ),
        endDate: parseTimestamp(
          formState.endDate,
          queryData?.settings.endDate || Date.now() + 30 * 24 * 3600 * 1000
        ),
        status: formState.status,
        capacity: formState.capacity,
        enrollmentStatus: formState.enrollmentStatus,
        allowWaitlist: formState.allowWaitlist,
        whatsappLink: formState.whatsappLink,
        googleMeetLink: formState.googleMeetLink,
        discordLink: formState.discordLink,
        notionLink: formState.notionLink,
        extraLinks: formState.extraLinks,
        attendanceEnabled: formState.attendanceEnabled,
        assignmentsEnabled: formState.assignmentsEnabled,
        certificatesEnabled: formState.certificatesEnabled,
        communityEnabled: formState.communityEnabled,
        aiTutorEnabled: formState.aiTutorEnabled,
        sandboxEnabled: formState.sandboxEnabled,
        isArchived: formState.isArchived,
      });

      setIsDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to save cohort settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // 6. DANGER ZONE OPERATIONS
  const handleArchiveConfirm = async () => {
    await archiveBatch({
      batchId,
      isArchived: !formState.isArchived,
    });
    handleFieldChange("isArchived", !formState.isArchived);
    setIsDirty(false);
  };

  const handleDuplicateConfirm = async (newTitle: string) => {
    const res = await duplicateBatch({
      batchId,
      newTitle,
    });
    if (res?.newBatchId) {
      router.push(`/admin/batches/${res.newBatchId}/overview`);
    }
  };

  const handleDeleteConfirm = async () => {
    await deleteBatch({ batchId });
    router.push("/admin/batches");
  };

  const handleJumpToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 7. LOADING AND NOT-FOUND FALLBACKS
  if (queryData === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm font-semibold text-text-secondary">
            Loading Cohort Enterprise Configuration...
          </p>
        </div>
      </div>
    );
  }

  if (queryData === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 font-bold">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">
          Cohort Workspace Not Found
        </h3>
        <p className="text-sm text-text-secondary max-w-md">
          The requested cohort batch could not be found or has been deleted.
        </p>
      </div>
    );
  }

  const { settings, resources, health } = queryData;

  // 8. RENDER ENTERPRISE COHORT CONFIGURATION WORKSPACE
  return (
    <div className="space-y-8 pb-28">
      {/* 1. Executive Configuration Toolbar */}
      <BatchSettingsToolbar
        settings={settings}
        completenessScore={health.completenessScore}
        onJumpToSection={handleJumpToSection}
        activeSection={activeSection}
      />

      {/* 2. Operational Health & Utilization Bento Banner */}
      <BatchSettingsHealthBanner
        enrolledCount={settings.enrolledCount}
        capacity={formState.capacity}
        health={health}
      />

      {/* 3. General Cohort Information Form Card */}
      <BatchSettingsGeneral
        title={formState.title}
        description={formState.description}
        instructorName={formState.instructorName}
        timezone={formState.timezone}
        startDate={formState.startDate}
        endDate={formState.endDate}
        status={formState.status}
        courseTitle={settings.courseTitle}
        courseSlug={settings.courseSlug}
        instructors={instructors || []}
        onChange={handleFieldChange}
      />

      {/* 4. Enrollment & Capacity Management Card */}
      <BatchSettingsEnrollment
        capacity={formState.capacity}
        enrolledCount={settings.enrolledCount}
        enrollmentStatus={formState.enrollmentStatus}
        allowWaitlist={formState.allowWaitlist}
        onChange={handleFieldChange}
      />

      {/* 5. Centralized Communication & Community Hubs */}
      <BatchSettingsCommunication
        whatsappLink={formState.whatsappLink}
        googleMeetLink={formState.googleMeetLink}
        discordLink={formState.discordLink}
        notionLink={formState.notionLink}
        extraLinks={formState.extraLinks}
        onChange={handleFieldChange}
      />

      {/* 6. Connected Resources Hub */}
      <BatchSettingsResourcesHub batchId={batchId} resources={resources} />

      {/* 7. Feature Entitlements & Toggles */}
      <BatchSettingsFeatures
        attendanceEnabled={formState.attendanceEnabled}
        assignmentsEnabled={formState.assignmentsEnabled}
        certificatesEnabled={formState.certificatesEnabled}
        aiTutorEnabled={formState.aiTutorEnabled}
        sandboxEnabled={formState.sandboxEnabled}
        onChange={handleFieldChange}
      />

      {/* 8. Destructive Danger Zone */}
      <BatchSettingsDangerZone
        isArchived={formState.isArchived}
        onOpenArchiveModal={() => setIsArchiveModalOpen(true)}
        onOpenDuplicateModal={() => setIsDuplicateModalOpen(true)}
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
      />

      {/* 9. Sticky Save & Feedback Bar */}
      <BatchSettingsSaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onReset={handleReset}
        onSave={handleSaveAll}
        saveSuccess={saveSuccess}
      />

      {/* 10. Irreversible Action Confirmation Modals */}
      <ArchiveBatchModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleArchiveConfirm}
        isArchived={formState.isArchived}
        batchTitle={formState.title}
      />

      <DuplicateBatchModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        onConfirm={handleDuplicateConfirm}
        batchTitle={formState.title}
      />

      <DeleteBatchModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        batchTitle={formState.title}
      />
    </div>
  );
}
