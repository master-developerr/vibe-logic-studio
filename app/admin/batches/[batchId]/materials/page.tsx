"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import {
  Loader2,
  Upload,
  BarChart2,
  Download,
  Plus,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { BatchMaterialsAnalytics } from "@/components/admin/materials/BatchMaterialsAnalytics";
import { BatchMaterialsDropzone } from "@/components/admin/materials/BatchMaterialsDropzone";
import { BatchMaterialsCollectionBar } from "@/components/admin/materials/BatchMaterialsCollectionBar";
import { BatchMaterialsFilterBar } from "@/components/admin/materials/BatchMaterialsFilterBar";
import {
  BatchMaterialsTable,
  StudyMaterialCMSItem,
} from "@/components/admin/materials/BatchMaterialsTable";
import { BatchMaterialsGrid } from "@/components/admin/materials/BatchMaterialsGrid";
import { BatchMaterialsBulkActions } from "@/components/admin/materials/BatchMaterialsBulkActions";
import { BatchMaterialDrawer } from "@/components/admin/materials/BatchMaterialDrawer";
import { UploadBatchMaterialModal } from "@/components/admin/materials/UploadBatchMaterialModal";

export default function BatchMaterialsTab() {
  const params = useParams();
  const batchId = params.batchId as any;

  // State Management
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showDropzone, setShowDropzone] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [activeCollection, setActiveCollection] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("order");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMaterial, setActiveMaterial] =
    useState<StudyMaterialCMSItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [customCollections, setCustomCollections] = useState<string[]>([]);

  // Convex Queries & Mutations
  const extendedData = useQuery(api.admin.getBatchStudyMaterialsExtended, {
    batchId,
  });

  const createMaterial = useMutation(
    api.admin.createBatchStudyMaterialExtended
  );
  const updateMaterial = useMutation(
    api.admin.updateBatchStudyMaterialExtended
  );
  const deleteMaterial = useMutation(
    api.admin.deleteBatchStudyMaterialExtended
  );
  const bulkUpdateMaterials = useMutation(
    api.admin.bulkUpdateStudyMaterialsExtended
  );
  const incrementDownload = useMutation(
    api.admin.incrementMaterialDownload
  );

  // Compute collections & list
  const materialsList: StudyMaterialCMSItem[] = useMemo(() => {
    if (!extendedData || !extendedData.studyMaterials) return [];
    return extendedData.studyMaterials as StudyMaterialCMSItem[];
  }, [extendedData]);

  const collectionsList = useMemo(() => {
    const counts: Record<string, number> = {};
    materialsList.forEach((m) => {
      counts[m.collection] = (counts[m.collection] || 0) + 1;
    });
    // merge custom empty collections
    customCollections.forEach((cc) => {
      if (counts[cc] === undefined) counts[cc] = 0;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [materialsList, customCollections]);

  // Filtered & Sorted Materials
  const filteredMaterials = useMemo(() => {
    let list = [...materialsList];

    // Filter by Collection
    if (activeCollection !== "all") {
      list = list.filter((m) => m.collection === activeCollection);
    }

    // Filter by Format
    if (selectedFormat !== "all") {
      list = list.filter(
        (m) => m.fileFormat.toUpperCase() === selectedFormat.toUpperCase()
      );
    }

    // Filter by Visibility
    if (selectedVisibility !== "all") {
      list = list.filter(
        (m) => m.visibility.toLowerCase() === selectedVisibility.toLowerCase()
      );
    }

    // Filter by Favorites
    if (favoritesOnly) {
      list = list.filter((m) => m.isFavorite);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.collection.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.fileFormat.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "order") return a.order - b.order;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "updated") return b.updatedAt - a.updatedAt;
      return 0;
    });

    return list;
  }, [
    materialsList,
    activeCollection,
    selectedFormat,
    selectedVisibility,
    favoritesOnly,
    searchQuery,
    sortBy,
  ]);

  // Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredMaterials.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleFavorite = async (material: StudyMaterialCMSItem) => {
    await updateMaterial({
      materialId: material.id as any,
      isFavorite: !material.isFavorite,
    });
  };

  const handleIncrementDownload = async (id: string) => {
    await incrementDownload({ materialId: id as any });
  };

  const handleDeleteMaterial = async (id: string) => {
    if (confirm("Are you sure you want to delete this study material?")) {
      await deleteMaterial({ materialId: id as any });
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      if (activeMaterial?.id === id) setActiveMaterial(null);
    }
  };

  const handleMoveOrder = async (id: string, direction: "up" | "down") => {
    const idx = filteredMaterials.findIndex((m) => m.id === id);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= filteredMaterials.length) return;

    const currentItem = filteredMaterials[idx];
    const targetItem = filteredMaterials[targetIdx];

    await Promise.all([
      updateMaterial({
        materialId: currentItem.id as any,
        order: targetItem.order,
      }),
      updateMaterial({
        materialId: targetItem.id as any,
        order: currentItem.order,
      }),
    ]);
  };

  const handleBulkMoveCollection = async (collectionName: string) => {
    await bulkUpdateMaterials({
      materialIds: selectedIds as any[],
      action: "move_collection",
      collection: collectionName,
    });
    setSelectedIds([]);
  };

  const handleBulkChangeVisibility = async (vis: string) => {
    await bulkUpdateMaterials({
      materialIds: selectedIds as any[],
      action: "change_visibility",
      visibility: vis,
    });
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    await bulkUpdateMaterials({
      materialIds: selectedIds as any[],
      action: "delete",
    });
    setSelectedIds([]);
  };

  const handleCreateCollection = (name: string) => {
    if (!customCollections.includes(name)) {
      setCustomCollections((prev) => [...prev, name]);
    }
  };

  const handleUploadNewMaterial = async (data: {
    title: string;
    type: string;
    fileUrl: string;
    collection: string;
    fileSize: string;
    fileFormat: string;
    visibility: string;
    description: string;
  }) => {
    await createMaterial({
      batchId,
      title: data.title,
      type: data.type,
      fileUrl: data.fileUrl,
      collection: data.collection,
      fileSize: data.fileSize,
      fileFormat: data.fileFormat,
      visibility: data.visibility,
      description: data.description,
    });
  };

  // Loading State
  if (extendedData === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-text-muted">
          Loading Curriculum Asset Studio...
        </p>
      </div>
    );
  }

  if (extendedData === null) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-12 text-center">
        <FolderOpen className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <h3 className="text-base font-bold text-text-primary">
          Batch Not Found
        </h3>
        <p className="text-xs text-text-muted mt-1">
          Please check the URL or return to course batches.
        </p>
      </div>
    );
  }

  const { stats } = extendedData;

  // Most Downloaded material
  const mostDownloadedMaterial =
    materialsList.length > 0
      ? [...materialsList].sort((a, b) => b.downloads - a.downloads)[0]
      : undefined;

  // Recent Uploads ticker
  const recentUploads = [...materialsList]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3)
    .map((m) => {
      const diffDays = Math.max(
        0,
        Math.floor((Date.now() - m.updatedAt) / (3600 * 1000 * 24))
      );
      const timeAgo =
        diffDays === 0
          ? "Today"
          : diffDays === 1
          ? "Yesterday"
          : `${diffDays}d ago`;
      return {
        id: m.id,
        title: m.title,
        fileFormat: m.fileFormat,
        fileSize: m.fileSize,
        uploadedBy: m.uploadedBy,
        timeAgo,
      };
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Page Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-text-primary tracking-tight">
              Curriculum Asset Studio
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {stats.totalFiles} {stats.totalFiles === 1 ? "Asset" : "Assets"}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Enterprise resource management, asset hosting, and distribution for{" "}
            <span className="font-semibold text-text-primary">
              {extendedData.course.title}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Analytics */}
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
              showAnalytics
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-background text-text-secondary border-border hover:text-text-primary"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{showAnalytics ? "Hide Analytics" : "Show Analytics"}</span>
          </button>

          {/* Toggle Quick Drop Dock */}
          <button
            onClick={() => setShowDropzone(!showDropzone)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
              showDropzone
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-background text-text-secondary border-border hover:text-text-primary"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{showDropzone ? "Hide Upload Dock" : "Quick Drop Dock"}</span>
          </button>

          {/* Primary Upload Button */}
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Material</span>
          </Button>
        </div>
      </div>

      {/* 4-Card Analytics Bento */}
      {showAnalytics && (
        <BatchMaterialsAnalytics
          stats={{
            totalFiles: stats.totalFiles,
            totalDownloads: stats.totalDownloads,
            storageUsedMB: stats.storageUsedMB,
            storageQuotaMB: stats.storageQuotaMB,
            formatDistribution: stats.formatDistribution,
            collections: stats.collections,
          }}
          mostDownloaded={
            mostDownloadedMaterial
              ? {
                  id: mostDownloadedMaterial.id,
                  title: mostDownloadedMaterial.title,
                  downloads: mostDownloadedMaterial.downloads,
                  fileFormat: mostDownloadedMaterial.fileFormat,
                  fileSize: mostDownloadedMaterial.fileSize,
                }
              : undefined
          }
          recentUploads={recentUploads}
        />
      )}

      {/* Inline Quick Drop Dock */}
      {showDropzone && (
        <BatchMaterialsDropzone
          onFileUploaded={async (fileInfo) => {
            await createMaterial({
              batchId,
              title: fileInfo.title,
              type: fileInfo.type,
              fileUrl: fileInfo.fileUrl,
              collection: activeCollection !== "all" ? activeCollection : "Module 1: Foundations",
              fileSize: fileInfo.fileSize,
              fileFormat: fileInfo.fileFormat,
              visibility: "Public",
              description: "Quick-dropped study material for this batch.",
            });
          }}
        />
      )}

      {/* Collection Category Navigation Bar */}
      <BatchMaterialsCollectionBar
        collections={collectionsList}
        activeCollection={activeCollection}
        onSelectCollection={setActiveCollection}
        favoritesOnly={favoritesOnly}
        onToggleFavoritesOnly={() => setFavoritesOnly(!favoritesOnly)}
        onCreateCollection={handleCreateCollection}
        totalCount={materialsList.length}
      />

      {/* Filter & Search Bar */}
      <BatchMaterialsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFormat={selectedFormat}
        onSelectFormat={setSelectedFormat}
        selectedVisibility={selectedVisibility}
        onSelectVisibility={setSelectedVisibility}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalFilteredCount={filteredMaterials.length}
      />

      {/* Main Asset Display: Table View or Grid Cards View */}
      {viewMode === "table" ? (
        <BatchMaterialsTable
          materials={filteredMaterials}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onEditMaterial={setActiveMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onToggleFavorite={handleToggleFavorite}
          onIncrementDownload={handleIncrementDownload}
          onMoveOrder={handleMoveOrder}
          onPreviewMaterial={setActiveMaterial}
        />
      ) : (
        <BatchMaterialsGrid
          materials={filteredMaterials}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onEditMaterial={setActiveMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onToggleFavorite={handleToggleFavorite}
          onIncrementDownload={handleIncrementDownload}
          onPreviewMaterial={setActiveMaterial}
        />
      )}

      {/* Floating Bulk Actions Command Bar */}
      <BatchMaterialsBulkActions
        selectedCount={selectedIds.length}
        collections={collectionsList}
        onClearSelection={() => setSelectedIds([])}
        onBulkMoveCollection={handleBulkMoveCollection}
        onBulkChangeVisibility={handleBulkChangeVisibility}
        onBulkDelete={handleBulkDelete}
        onBulkDownloadZip={() => {
          // Simulated zip alert
          alert(
            `Archive generation completed! Downloading ${selectedIds.length} assets as a ZIP package.`
          );
          setSelectedIds([]);
        }}
      />

      {/* CMS Asset Details Slide-Over Drawer */}
      <BatchMaterialDrawer
        material={activeMaterial}
        onClose={() => setActiveMaterial(null)}
        onSave={async (id, updates) => {
          await updateMaterial({
            materialId: id as any,
            ...updates,
          });
        }}
        collections={collectionsList}
      />

      {/* Upload New Study Material Modal */}
      <UploadBatchMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadNewMaterial}
        collections={collectionsList}
      />
    </div>
  );
}
