"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Video,
  Hash,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

interface ExtraLinkItem {
  title: string;
  url: string;
}

interface BatchSettingsCommunicationProps {
  whatsappLink: string;
  googleMeetLink: string;
  discordLink: string;
  notionLink: string;
  extraLinks: ExtraLinkItem[];
  onChange: (field: string, value: any) => void;
}

export function BatchSettingsCommunication({
  whatsappLink,
  googleMeetLink,
  discordLink,
  notionLink,
  extraLinks,
  onChange,
}: BatchSettingsCommunicationProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleTestLink = (url: string) => {
    if (!url) return;
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(cleanUrl, "_blank", "noopener,noreferrer");
  };

  const handleAddCustomLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const nextLinks = [...extraLinks, { title: newTitle.trim(), url: newUrl.trim() }];
    onChange("extraLinks", nextLinks);
    setNewTitle("");
    setNewUrl("");
    setIsAdding(false);
  };

  const handleRemoveCustomLink = (idx: number) => {
    const nextLinks = extraLinks.filter((_, i) => i !== idx);
    onChange("extraLinks", nextLinks);
  };

  return (
    <div
      id="communication"
      className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6 scroll-mt-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Centralized Communication & Community Hubs
            </h2>
            <p className="text-xs text-text-secondary">
              Configure real-time student chat, live video rooms, discord servers, and documentation links
            </p>
          </div>
        </div>
      </div>

      {/* Primary Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* WhatsApp Group */}
        <div className="p-4 rounded-xl border border-border bg-[#FAF7F3]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Community URL
            </span>
            {whatsappLink && (
              <button
                type="button"
                onClick={() => handleTestLink(whatsappLink)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <input
            type="url"
            value={whatsappLink}
            onChange={(e) => onChange("whatsappLink", e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
            className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <p className="text-[11px] text-text-muted">
            Displayed in student dashboard top banner and onboarding welcome email.
          </p>
        </div>

        {/* Google Meet Room */}
        <div className="p-4 rounded-xl border border-border bg-[#FAF7F3]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-blue-600" />
              Primary Google Meet Room URL
            </span>
            {googleMeetLink && (
              <button
                type="button"
                onClick={() => handleTestLink(googleMeetLink)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <input
            type="url"
            value={googleMeetLink}
            onChange={(e) => onChange("googleMeetLink", e.target.value)}
            placeholder="https://meet.google.com/qgz-vibe-studio"
            className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <p className="text-[11px] text-text-muted">
            Used as default room fallback when scheduling new live classes.
          </p>
        </div>

        {/* Discord Server */}
        <div className="p-4 rounded-xl border border-border bg-[#FAF7F3]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-600" />
              Discord Community Server URL
            </span>
            {discordLink && (
              <button
                type="button"
                onClick={() => handleTestLink(discordLink)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <input
            type="url"
            value={discordLink}
            onChange={(e) => onChange("discordLink", e.target.value)}
            placeholder="https://discord.gg/vibelogic-studio"
            className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <p className="text-[11px] text-text-muted">
            Gives students access to code reviews, channel study groups, and hackathons.
          </p>
        </div>

        {/* Notion Workspace */}
        <div className="p-4 rounded-xl border border-border bg-[#FAF7F3]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-text-primary" />
              Notion Cohort Hub URL
            </span>
            {notionLink && (
              <button
                type="button"
                onClick={() => handleTestLink(notionLink)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <input
            type="url"
            value={notionLink}
            onChange={(e) => onChange("notionLink", e.target.value)}
            placeholder="https://notion.so/vibelogic-studio"
            className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <p className="text-[11px] text-text-muted">
            Central repository for assignment rubrics, reading lists, and cheat sheets.
          </p>
        </div>
      </div>

      {/* Additional Custom Channels Section */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-primary" />
              Additional Custom Cohort Links
            </h3>
            <p className="text-xs text-text-secondary">
              Add extra resources (GitHub org, Figma workspace, Miro whiteboard, etc.)
            </p>
          </div>
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Channel
            </button>
          )}
        </div>

        {/* List of Custom Links */}
        {extraLinks.length > 0 && (
          <div className="space-y-2 mb-3">
            {extraLinks.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-[#FAF7F3]/30"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-xs font-bold text-text-primary truncate">
                    {item.title}
                  </span>
                  <span className="text-xs text-text-muted truncate">
                    ({item.url})
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => handleTestLink(item.url)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Test</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomLink(idx)}
                    className="text-text-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inline Custom Link Adder Form */}
        {isAdding && (
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                  Channel / Resource Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. GitHub Team Organization"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-text-secondary mb-1">
                  Full URL address
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://github.com/vibelogic-studio"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-text-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomLink}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all"
              >
                Save Custom Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
