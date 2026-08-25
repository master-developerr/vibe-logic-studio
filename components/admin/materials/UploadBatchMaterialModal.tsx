"use client";

import React, { useState } from "react";
import { X, Upload, FileText, Link as LinkIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadBatchMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {
    title: string;
    type: string;
    fileUrl: string;
    collection: string;
    fileSize: string;
    fileFormat: string;
    visibility: string;
    description: string;
  }) => Promise<void>;
  collections: Array<{ name: string; count: number }>;
}

export function UploadBatchMaterialModal({
  isOpen,
  onClose,
  onUpload,
  collections,
}: UploadBatchMaterialModalProps) {
  const [title, setTitle] = useState("");
  const [collection, setCollection] = useState("Module 1: Foundations");
  const [fileFormat, setFileFormat] = useState("PDF");
  const [fileSize, setFileSize] = useState("2.4 MB");
  const [visibility, setVisibility] = useState("Public");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFormatChange = (fmt: string) => {
    setFileFormat(fmt);
    if (fmt === "PDF") setFileSize("2.4 MB");
    else if (fmt === "DOCX") setFileSize("1.1 MB");
    else if (fmt === "PPTX") setFileSize("8.5 MB");
    else if (fmt === "ZIP") setFileSize("24.0 MB");
    else if (fmt === "MP4") setFileSize("148.2 MB");
    else if (fmt === "CODE") setFileSize("340 KB");
    else if (fmt === "LINK") setFileSize("External URL");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanTitle);
      const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
      handleFormatChange(ext);
      const sizeMB = (file.size / 1000000).toFixed(1);
      setFileSize(`${sizeMB} MB`);
      setFileUrl(
        `https://vibelogic.studio/cdn/assets/${encodeURIComponent(file.name)}`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsUploading(true);
    try {
      const type =
        fileFormat === "PDF"
          ? "pdf"
          : fileFormat === "MP4"
          ? "video"
          : fileFormat === "LINK"
          ? "link"
          : "docx";
      const finalUrl =
        fileUrl ||
        `https://vibelogic.studio/cdn/assets/${encodeURIComponent(
          title.replace(/\s+/g, "-")
        )}.${fileFormat.toLowerCase()}`;

      await onUpload({
        title: title.trim(),
        type,
        fileUrl: finalUrl,
        collection,
        fileSize,
        fileFormat,
        visibility,
        description:
          description ||
          "Newly published study material for student curriculum.",
      });
      onClose();
      // Reset
      setTitle("");
      setDescription("");
      setFileUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Upload New Study Material
              </h3>
              <p className="text-xs text-text-muted">
                Add learning resources, slides, or code templates to this batch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Picker Zone */}
          <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center bg-background/50 transition-colors">
            <input
              type="file"
              id="modal-file-upload"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="modal-file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-text-primary">
                Click to browse file from device
              </span>
              <span className="text-xs text-text-muted mt-0.5">
                PDF, DOCX, PPTX, ZIP, MP4, or code files up to 500 MB
              </span>
            </label>
          </div>

          {/* Title input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Asset Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Module 1 - Core AI Architecture Reference"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold text-text-primary outline-none focus:border-primary"
            />
          </div>

          {/* Collection & Format */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Collection
              </label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-text-primary outline-none focus:border-primary"
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

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                File Format
              </label>
              <select
                value={fileFormat}
                onChange={(e) => handleFormatChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-text-primary outline-none focus:border-primary"
              >
                <option value="PDF">PDF Document</option>
                <option value="DOCX">DOCX Document</option>
                <option value="PPTX">PPTX Slide Deck</option>
                <option value="ZIP">ZIP Archive</option>
                <option value="MP4">MP4 Video</option>
                <option value="CODE">Code Template</option>
                <option value="LINK">External Link</option>
              </select>
            </div>
          </div>

          {/* Visibility & File Size */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Access Level
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-text-primary outline-none focus:border-primary"
              >
                <option value="Public">Public (All Enrolled)</option>
                <option value="Students Only">Students Only</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Estimated File Size
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold text-text-secondary outline-none focus:border-primary"
              >
              </input>
            </div>
          </div>

          {/* Companion Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Companion Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what this study material covers and how students should use it..."
              className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs text-text-primary outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Submit Footer */}
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
              disabled={isUploading || !title.trim()}
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6"
            >
              {isUploading ? "Uploading & Publishing..." : "Publish Asset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
