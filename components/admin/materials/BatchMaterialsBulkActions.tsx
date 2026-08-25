"use client";

import React, { useState } from "react";
import { Folder, Eye, Trash2, Download, X, Check, Loader2 } from "lucide-react";

interface BatchMaterialsBulkActionsProps {
  selectedCount: number;
  collections: Array<{ name: string; count: number }>;
  onClearSelection: () => void;
  onBulkMoveCollection: (collectionName: string) => void;
  onBulkChangeVisibility: (visibility: string) => void;
  onBulkDelete: () => void;
  onBulkDownloadZip?: () => void;
}

export function BatchMaterialsBulkActions({
  selectedCount,
  collections,
  onClearSelection,
  onBulkMoveCollection,
  onBulkChangeVisibility,
  onBulkDelete,
  onBulkDownloadZip,
}: BatchMaterialsBulkActionsProps) {
  const [activeMenu, setActiveMenu] = useState<
    "collection" | "visibility" | "delete" | null
  >(null);
  const [isZipping, setIsZipping] = useState(false);

  if (selectedCount === 0) return null;

  const handleZipDownload = () => {
    setIsZipping(true);
    setTimeout(() => {
      setIsZipping(false);
      onBulkDownloadZip?.();
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface border border-border shadow-xl rounded-2xl px-5 py-3 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Selected badge & Clear */}
      <div className="flex items-center gap-2 border-r border-border pr-3">
        <span className="w-6 h-6 rounded-lg bg-primary text-white text-xs font-extrabold flex items-center justify-center">
          {selectedCount}
        </span>
        <span className="text-xs font-bold text-text-primary">
          {selectedCount === 1 ? "Asset Selected" : "Assets Selected"}
        </span>
        <button
          onClick={onClearSelection}
          className="text-text-muted hover:text-text-primary p-1 rounded-md"
          title="Clear selection"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 relative">
        {/* Move to Collection */}
        <div className="relative">
          <button
            onClick={() =>
              setActiveMenu(
                activeMenu === "collection" ? null : "collection"
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border hover:border-primary/50 text-xs font-bold text-text-primary transition-colors"
          >
            <Folder className="w-3.5 h-3.5 text-primary" />
            <span>Move to Collection</span>
          </button>

          {activeMenu === "collection" && (
            <div className="absolute bottom-full mb-2 left-0 w-52 bg-surface border border-border rounded-xl shadow-lg p-1.5 z-50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-2.5 py-1">
                Select Target Collection
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1 mt-1">
                {collections.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      onBulkMoveCollection(col.name);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-text-primary hover:bg-background flex items-center justify-between"
                  >
                    <span className="truncate">{col.name}</span>
                    <span className="text-[10px] text-text-muted">
                      {col.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Change Visibility */}
        <div className="relative">
          <button
            onClick={() =>
              setActiveMenu(
                activeMenu === "visibility" ? null : "visibility"
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border hover:border-primary/50 text-xs font-bold text-text-primary transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Set Visibility</span>
          </button>

          {activeMenu === "visibility" && (
            <div className="absolute bottom-full mb-2 left-0 w-44 bg-surface border border-border rounded-xl shadow-lg p-1.5 z-50 space-y-1">
              {["Public", "Students Only", "Draft", "Archived"].map((vis) => (
                <button
                  key={vis}
                  onClick={() => {
                    onBulkChangeVisibility(vis);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-text-primary hover:bg-background"
                >
                  {vis}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Download as ZIP */}
        <button
          onClick={handleZipDownload}
          disabled={isZipping}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border hover:border-primary/50 text-xs font-bold text-text-primary transition-colors disabled:opacity-50"
        >
          {isZipping ? (
            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5 text-green-600" />
          )}
          <span>{isZipping ? "Archiving..." : "Download ZIP"}</span>
        </button>

        {/* Delete */}
        <button
          onClick={() => {
            if (
              confirm(
                `Are you sure you want to permanently delete ${selectedCount} selected study material(s)?`
              )
            ) {
              onBulkDelete();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-200 text-xs font-bold text-red-600 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
