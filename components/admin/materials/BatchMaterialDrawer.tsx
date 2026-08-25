"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Save,
  Download,
  Eye,
  FileText,
  Folder,
  Star,
  Lock,
  Calendar,
  User,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudyMaterialCMSItem } from "./BatchMaterialsTable";
import { FormatIcon, getFormatColor } from "./MaterialIcons";

interface BatchMaterialDrawerProps {
  material: StudyMaterialCMSItem | null;
  onClose: () => void;
  onSave: (id: string, updates: {
    title?: string;
    collection?: string;
    visibility?: string;
    description?: string;
    fileUrl?: string;
    order?: number;
    isFavorite?: boolean;
  }) => Promise<void>;
  collections: Array<{ name: string; count: number }>;
}

export function BatchMaterialDrawer({
  material,
  onClose,
  onSave,
  collections,
}: BatchMaterialDrawerProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview");
  const [title, setTitle] = useState("");
  const [collection, setCollection] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (material) {
      setTitle(material.title);
      setCollection(material.collection);
      setVisibility(material.visibility);
      setDescription(material.description);
      setFileUrl(material.fileUrl);
      setOrder(material.order);
      setIsFavorite(material.isFavorite);
    }
  }, [material]);

  if (!material) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(material.fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(material.id, {
        title,
        collection,
        visibility,
        description,
        fileUrl,
        order: Number(order),
        isFavorite,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface border-l border-border h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border bg-background flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center shrink-0">
              <FormatIcon format={material.fileFormat} className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wider uppercase ${getFormatColor(
                    material.fileFormat
                  )}`}
                >
                  {material.fileFormat}
                </span>
                <span className="text-xs font-semibold text-text-muted">
                  {material.fileSize}
                </span>
                {material.isFavorite && (
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                )}
              </div>
              <h3 className="text-base font-bold text-text-primary truncate mt-0.5">
                {material.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Copied URL</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Share URL</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-border bg-background">
          <button
            onClick={() => setActiveTab("preview")}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === "preview"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            Asset Preview & Reader
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === "editor"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-primary"
            }`}
          >
            CMS Metadata & Settings
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "preview" ? (
            /* ASSET PREVIEW TAB */
            <div className="space-y-6">
              {/* Simulated Interactive Document / Asset Viewer */}
              <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-inner">
                {/* Viewer Top Controls */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">
                      {material.fileFormat} Reader Engine
                    </span>
                    <span className="text-[10px] text-text-muted">• Page 1 of 18</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                      className="p-1 rounded hover:bg-background"
                      title="Zoom out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-bold min-w-[36px] text-center">
                      {zoom}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(150, zoom + 10))}
                      className="p-1 rounded hover:bg-background"
                      title="Zoom in"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Viewer Body */}
                <div className="p-8 min-h-[340px] flex flex-col items-center justify-center text-center bg-background/50">
                  <div
                    className="w-full max-w-md bg-surface border border-border rounded-xl p-8 shadow-sm transition-transform"
                    style={{ transform: `scale(${zoom / 100})` }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                      <FormatIcon
                        format={material.fileFormat}
                        className="w-8 h-8 text-primary"
                      />
                    </div>
                    <h4 className="text-base font-bold text-text-primary">
                      {material.title}
                    </h4>
                    <p className="text-xs text-text-muted mt-1">
                      {material.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-3 text-xs">
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-sm transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Original ({material.fileSize})</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Metrics & Audit Trail Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>Upload Timestamp</span>
                  </div>
                  <p className="text-sm font-extrabold text-text-primary">
                    {new Date(material.updatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    By {material.uploadedBy}
                  </p>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Student Access</span>
                  </div>
                  <p className="text-sm font-extrabold text-text-primary">
                    {material.downloads.toLocaleString()} Downloads
                  </p>
                  <p className="text-xs text-green-600 font-semibold mt-0.5">
                    {material.visibility} Access Rights
                  </p>
                </div>
              </div>

              {/* Direct Asset CDN Link */}
              <div className="bg-surface border border-border rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Global CDN Endpoint
                </span>
                <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-2.5">
                  <span className="text-xs font-mono text-text-primary truncate flex-1">
                    {material.fileUrl}
                  </span>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-lg hover:bg-surface text-text-secondary hover:text-primary"
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* CMS METADATA EDITOR TAB */
            <form onSubmit={handleSave} className="space-y-5">
              {/* Title & Favorite */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Asset Title
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFavorite}
                      onChange={(e) => setIsFavorite(e.target.checked)}
                      className="rounded border-border text-amber-500 focus:ring-amber-500"
                    />
                    <span>Mark as Highlighted / Favorite</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold text-text-primary outline-none focus:border-primary"
                />
              </div>

              {/* Collection & Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Curated Collection
                  </label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold text-text-primary outline-none focus:border-primary"
                  >
                    {collections.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Resources">Resources</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Module 1: Foundations">
                      Module 1: Foundations
                    </option>
                    <option value="Day 1: Intro to AI">Day 1: Intro to AI</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Sort Order Priority
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold text-text-primary outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Visibility Access Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Visibility & Student Enrollment Rights
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Public", "Students Only", "Draft", "Archived"].map(
                    (vis) => (
                      <button
                        type="button"
                        key={vis}
                        onClick={() => setVisibility(vis)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all text-center ${
                          visibility === vis
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-background text-text-secondary border-border hover:text-text-primary"
                        }`}
                      >
                        {vis}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Companion Description & Learning Notes
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain how students should utilize this study material..."
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text-primary outline-none focus:border-primary resize-none"
                />
              </div>

              {/* File URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Asset File URL / Endpoint
                </label>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-mono text-text-primary outline-none focus:border-primary"
                />
              </div>

              {/* Save footer */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
