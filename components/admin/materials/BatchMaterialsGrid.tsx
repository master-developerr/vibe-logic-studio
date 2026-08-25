"use client";

import React from "react";
import {
  Star,
  ExternalLink,
  Copy,
  Edit2,
  Trash2,
  Download,
  Eye,
  Check,
  Folder,
  FileText,
} from "lucide-react";
import { StudyMaterialCMSItem } from "./BatchMaterialsTable";
import { FormatIcon, getFormatColor } from "./MaterialIcons";

interface BatchMaterialsGridProps {
  materials: StudyMaterialCMSItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onEditMaterial: (material: StudyMaterialCMSItem) => void;
  onDeleteMaterial: (id: string) => void;
  onToggleFavorite: (material: StudyMaterialCMSItem) => void;
  onIncrementDownload: (id: string) => void;
  onPreviewMaterial: (material: StudyMaterialCMSItem) => void;
}

export function BatchMaterialsGrid({
  materials,
  selectedIds,
  onToggleSelect,
  onEditMaterial,
  onDeleteMaterial,
  onToggleFavorite,
  onIncrementDownload,
  onPreviewMaterial,
}: BatchMaterialsGridProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "Public":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
            Public
          </span>
        );
      case "Students Only":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
            Students Only
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
            Draft
          </span>
        );
      case "Archived":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/10 text-text-muted border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface text-text-secondary border border-border">
            {visibility}
          </span>
        );
    }
  };

  if (materials.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 shadow-inner">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-text-primary">
          No Study Materials Found
        </h3>
        <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
          No learning resources match the current filter or search criteria. Try clearing filters or dropping new files into the upload dock above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {materials.map((m) => {
        const isSelected = selectedIds.includes(m.id);
        return (
          <div
            key={m.id}
            className={`bg-surface border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${
              isSelected
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-border/80"
            }`}
          >
            {/* Top row: Checkbox + Format badge + Favorite */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(m.id)}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wider uppercase ${getFormatColor(
                      m.fileFormat
                    )}`}
                  >
                    {m.fileFormat}
                  </span>
                  <span className="text-xs font-semibold text-text-muted">
                    {m.fileSize}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {getVisibilityBadge(m.visibility)}
                  <button
                    onClick={() => onToggleFavorite(m)}
                    className={`p-1 rounded hover:bg-background transition-colors ${
                      m.isFavorite
                        ? "text-amber-500"
                        : "text-text-muted hover:text-amber-500 opacity-60 hover:opacity-100"
                    }`}
                    title={
                      m.isFavorite ? "Remove favorite" : "Mark favorite"
                    }
                  >
                    <Star
                      className={`w-4 h-4 ${
                        m.isFavorite ? "fill-amber-500" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0">
                  <FormatIcon format={m.fileFormat} className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => onPreviewMaterial(m)}
                    className="text-sm font-bold text-text-primary hover:text-primary transition-colors text-left block truncate"
                  >
                    {m.title}
                  </button>
                  <p className="text-xs text-text-muted line-clamp-2 mt-1">
                    {m.description}
                  </p>
                </div>
              </div>

              {/* Collection pill & Downloads counter */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/60">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border border-border/80 text-[11px] font-semibold text-text-secondary truncate">
                  <Folder className="w-3 h-3 text-text-muted shrink-0" />
                  <span className="truncate">{m.collection}</span>
                </span>

                <div className="inline-flex items-center gap-1.5 bg-background border border-border/80 rounded-xl px-2.5 py-1 shrink-0">
                  <span className="text-xs font-extrabold text-text-primary">
                    {m.downloads.toLocaleString()} DLs
                  </span>
                  <button
                    onClick={() => onIncrementDownload(m.id)}
                    className="text-text-muted hover:text-primary p-0.5 rounded transition-colors"
                    title="Simulate student download (+1)"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-border/60">
              <span className="text-[11px] text-text-muted truncate max-w-[140px]">
                By {m.uploadedBy.split(" ")[0]}
              </span>

              <div className="flex items-center gap-1">
                {/* Preview Asset */}
                <button
                  onClick={() => onPreviewMaterial(m)}
                  className="p-1.5 rounded-lg border border-border bg-background text-text-secondary hover:text-primary hover:border-primary/50 transition-colors"
                  title="Preview Asset & Reader"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                {/* Copy URL */}
                <button
                  onClick={() => handleCopyUrl(m.fileUrl, m.id)}
                  className="p-1.5 rounded-lg border border-border bg-background text-text-secondary hover:text-primary hover:border-primary/50 transition-colors"
                  title={copiedId === m.id ? "Copied URL!" : "Copy Asset URL"}
                >
                  {copiedId === m.id ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Edit Material */}
                <button
                  onClick={() => onEditMaterial(m)}
                  className="p-1.5 rounded-lg border border-border bg-background text-text-secondary hover:text-text-primary transition-colors"
                  title="Edit Resource Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeleteMaterial(m.id)}
                  className="p-1.5 rounded-lg border border-border bg-background text-text-muted hover:text-red-600 hover:border-red-200 transition-colors"
                  title="Delete Material"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
