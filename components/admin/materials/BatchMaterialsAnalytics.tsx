"use client";

import React from "react";
import { FormatIcon, getFormatColor } from "./MaterialIcons";
import { Download, HardDrive, TrendingUp, Clock, AlertCircle } from "lucide-react";

interface BatchMaterialsAnalyticsProps {
  stats: {
    totalFiles: number;
    totalDownloads: number;
    storageUsedMB: number;
    storageQuotaMB: number;
    formatDistribution: Array<{
      format: string;
      count: number;
      percentage: number;
    }>;
    collections: Array<{
      name: string;
      count: number;
    }>;
  };
  mostDownloaded?: {
    id: string;
    title: string;
    downloads: number;
    fileFormat: string;
    fileSize: string;
  };
  recentUploads?: Array<{
    id: string;
    title: string;
    fileFormat: string;
    fileSize: string;
    uploadedBy: string;
    timeAgo: string;
  }>;
}

export function BatchMaterialsAnalytics({
  stats,
  mostDownloaded,
  recentUploads = [],
}: BatchMaterialsAnalyticsProps) {
  const usagePct = Math.min(
    100,
    Math.round((stats.storageUsedMB / stats.storageQuotaMB) * 100)
  );

  const formatMB = (mb: number) => {
    if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Storage Health & Quota Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Storage Quota
              </span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                usagePct < 75
                  ? "bg-green-500/10 text-green-700 border border-green-200"
                  : usagePct < 90
                  ? "bg-amber-500/10 text-amber-700 border border-amber-200"
                  : "bg-red-500/10 text-red-700 border border-red-200"
              }`}
            >
              {usagePct < 75 ? "Optimal Health" : usagePct < 90 ? "Warning" : "Critical"}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3">
            <div className="text-xl font-extrabold text-text-primary tracking-tight">
              {formatMB(stats.storageUsedMB)}
            </div>
            <div className="text-xs font-semibold text-text-muted">
              of {formatMB(stats.storageQuotaMB)} ({usagePct}%)
            </div>
          </div>

          <div className="w-full h-2 bg-background rounded-full overflow-hidden mt-2 border border-border/60">
            <div
              className={`h-full transition-all duration-500 ${
                usagePct < 75 ? "bg-primary" : usagePct < 90 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-secondary">
          <span>All cohorts active</span>
          <span className="font-semibold text-primary">Upgrade Quota →</span>
        </div>
      </div>

      {/* Format Distribution Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Asset Formats
            </span>
            <span className="text-xs font-bold text-text-primary">
              {stats.totalFiles} Total Files
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {stats.formatDistribution.map((fd) => (
              <span
                key={fd.format}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${getFormatColor(
                  fd.format
                )}`}
              >
                <span>{fd.format}</span>
                <span className="text-[10px] font-bold opacity-70">
                  {fd.count}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-secondary">
          <span>{stats.collections.length} Collections</span>
          <span className="font-semibold">Organized</span>
        </div>
      </div>

      {/* Engagement & Downloads Leader Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Cohort Engagement
              </span>
            </div>
            <span className="text-xs font-bold text-green-600">
              +14.2% vs last week
            </span>
          </div>

          <div className="text-2xl font-extrabold text-text-primary tracking-tight mt-2">
            {stats.totalDownloads.toLocaleString()}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Total asset downloads & previews
          </p>
        </div>

        {mostDownloaded && (
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
            <div className="truncate max-w-[170px]">
              <span className="text-text-muted">Top: </span>
              <span className="font-semibold text-text-primary">
                {mostDownloaded.title}
              </span>
            </div>
            <span className="font-bold text-primary shrink-0">
              {mostDownloaded.downloads} DLs
            </span>
          </div>
        )}
      </div>

      {/* Recent Activity Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Recent Uploads
              </span>
            </div>
            <span className="text-[10px] font-bold text-text-muted uppercase">
              Live Feed
            </span>
          </div>

          {recentUploads.length > 0 ? (
            <div className="space-y-2 mt-2">
              {recentUploads.slice(0, 2).map((ru) => (
                <div
                  key={ru.id}
                  className="flex items-center justify-between text-xs bg-background/60 p-2 rounded-lg border border-border/60"
                >
                  <div className="flex items-center gap-2 truncate max-w-[160px]">
                    <FormatIcon format={ru.fileFormat} className="w-4 h-4 shrink-0 text-text-secondary" />
                    <span className="font-semibold text-text-primary truncate">
                      {ru.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted shrink-0">
                    {ru.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-text-muted mt-3 italic">
              No recent asset activity
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-secondary">
          <span>Synced with Cloud Replay</span>
          <span className="font-semibold text-green-600">100% Online</span>
        </div>
      </div>
    </div>
  );
}
