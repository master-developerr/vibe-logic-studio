"use client";

import React from "react";
import {
  Star,
  ExternalLink,
  Copy,
  Edit2,
  Trash2,
  Download,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  Folder,
  FileText,
} from "lucide-react";
import { FormatIcon, getFormatColor } from "./MaterialIcons";

export interface StudyMaterialCMSItem {
  id: string;
  courseId: string;
  title: string;
  type: string;
  fileUrl: string;
  order: number;
  collection: string;
  fileSize: string;
  fileFormat: string;
  downloads: number;
  visibility: string;
  description: string;
  uploadedBy: string;
  updatedAt: number;
  isFavorite: boolean;
}

interface BatchMaterialsTableProps {
  materials: StudyMaterialCMSItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEditMaterial: (material: StudyMaterialCMSItem) => void;
  onDeleteMaterial: (id: string) => void;
  onToggleFavorite: (material: StudyMaterialCMSItem) => void;
  onIncrementDownload: (id: string) => void;
  onMoveOrder?: (id: string, direction: "up" | "down") => void;
  onPreviewMaterial: (material: StudyMaterialCMSItem) => void;
}

export function BatchMaterialsTable({
  materials,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEditMaterial,
  onDeleteMaterial,
  onToggleFavorite,
  onIncrementDownload,
  onMoveOrder,
  onPreviewMaterial,
}: BatchMaterialsTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const allSelected =
    materials.length > 0 &&
    materials.every((m) => selectedIds.includes(m.id));

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "Public":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/10 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
            Public
          </span>
        );
      case "Students Only":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
            Students Only
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
            Draft
          </span>
        );
      case "Archived":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-500/10 text-text-muted border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface text-text-secondary border border-border">
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
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background/80 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3 px-2 w-16 text-center">Order</th>
              <th className="py-3 px-4">Asset & Collection</th>
              <th className="py-3 px-4">Format & Size</th>
              <th className="py-3 px-4">Visibility</th>
              <th className="py-3 px-4 text-center">Downloads</th>
              <th className="py-3 px-4">Uploaded / Modified</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {materials.map((m, idx) => {
              const isSelected = selectedIds.includes(m.id);
              return (
                <tr
                  key={m.id}
                  className={`group transition-colors ${
                    isSelected
                      ? "bg-primary/5"
                      : "hover:bg-background/60"
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(m.id)}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Order / Reorder + Favorite */}
                  <td className="py-3.5 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(m)}
                        className={`p-1 rounded hover:bg-surface transition-colors ${
                          m.isFavorite
                            ? "text-amber-500"
                            : "text-text-muted hover:text-amber-500 opacity-40 group-hover:opacity-100"
                        }`}
                        title={m.isFavorite ? "Remove favorite" : "Mark favorite"}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            m.isFavorite ? "fill-amber-500" : ""
                          }`}
                        />
                      </button>
                      <span className="text-xs font-extrabold text-text-secondary min-w-[20px]">
                        {String(m.order).padStart(2, "0")}
                      </span>
                      {onMoveOrder && (
                        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onMoveOrder(m.id, "up")}
                            disabled={idx === 0}
                            className="text-text-muted hover:text-text-primary disabled:opacity-20"
                            title="Move up"
                          >
                            <ArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={() => onMoveOrder(m.id, "down")}
                            disabled={idx === materials.length - 1}
                            className="text-text-muted hover:text-text-primary disabled:opacity-20"
                            title="Move down"
                          >
                            <ArrowDown className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Title & Collection */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <FormatIcon format={m.fileFormat} className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => onPreviewMaterial(m)}
                          className="text-sm font-bold text-text-primary hover:text-primary transition-colors text-left block truncate max-w-sm"
                        >
                          {m.title}
                        </button>
                        <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                          {m.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background border border-border/80 text-[10px] font-semibold text-text-secondary">
                            <Folder className="w-2.5 h-2.5 text-text-muted" />
                            {m.collection}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Format Badge & File Size */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wider uppercase ${getFormatColor(
                          m.fileFormat
                        )}`}
                      >
                        {m.fileFormat}
                      </span>
                      <span className="text-xs font-semibold text-text-secondary">
                        {m.fileSize}
                      </span>
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getVisibilityBadge(m.visibility)}
                  </td>

                  {/* Downloads */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 bg-background border border-border/80 rounded-xl px-3 py-1">
                      <span className="text-xs font-extrabold text-text-primary">
                        {m.downloads.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onIncrementDownload(m.id)}
                        className="text-text-muted hover:text-primary p-0.5 rounded transition-colors"
                        title="Simulate student download (+1)"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Uploaded By / Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="text-xs font-bold text-text-primary truncate max-w-[150px]">
                      {m.uploadedBy}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {new Date(m.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
