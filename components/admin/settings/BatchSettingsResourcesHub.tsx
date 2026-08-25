"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  FileText,
  Video,
  Megaphone,
  Image as ImageIcon,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { BatchResourcesSummary } from "./types";

interface BatchSettingsResourcesHubProps {
  batchId: string;
  resources: BatchResourcesSummary;
}

export function BatchSettingsResourcesHub({
  batchId,
  resources,
}: BatchSettingsResourcesHubProps) {
  const router = useRouter();

  const cards = [
    {
      title: "Study Materials & Curriculum",
      desc: "Managed PDFs, cheat sheets, code archives, and companion workbooks.",
      count: `${resources.studyMaterialsCount} files loaded`,
      icon: FileText,
      iconBg: "bg-orange-100 text-orange-700",
      path: `/admin/batches/${batchId}/materials`,
      cta: "Manage Materials",
    },
    {
      title: "Class Video Recordings",
      desc: "HD cloud session recordings, YouTube embeds, and replay analytics.",
      count: `${resources.recordingsCount} videos recorded`,
      icon: Video,
      iconBg: "bg-blue-100 text-blue-700",
      path: `/admin/batches/${batchId}/recordings`,
      cta: "Manage Recordings",
    },
    {
      title: "Student Announcements",
      desc: "Targeted cohort broadcasts, pinned notices, and alert logs.",
      count: `${resources.announcementsCount} live announcements`,
      icon: Megaphone,
      iconBg: "bg-purple-100 text-purple-700",
      path: `/admin/batches/${batchId}/announcements`,
      cta: "Manage Broadcasts",
    },
    {
      title: "Course Media Asset Library",
      desc: "Shared branding images, thumbnails, and downloadable design tokens.",
      count: "Global CDN assets",
      icon: ImageIcon,
      iconBg: "bg-emerald-100 text-emerald-700",
      path: "/admin/media",
      cta: "Open Media Studio",
    },
  ];

  return (
    <div
      id="resources"
      className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-5 scroll-mt-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Connected Cohort Content & Resource Hubs
            </h2>
            <p className="text-xs text-text-secondary">
              Quickly inspect and navigate to managed materials, video archives, and broadcasts for this cohort
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border bg-[#FAF7F3]/40 hover:bg-[#FAF7F3] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      {card.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5 leading-snug">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-text-muted">
                  {card.count}
                </span>
                <button
                  type="button"
                  onClick={() => router.push(card.path)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
