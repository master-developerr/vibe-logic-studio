"use client";

import React, { useState } from "react";
import { FolderPlus, Star, Folder, Check, Plus, X } from "lucide-react";

interface BatchMaterialsCollectionBarProps {
  collections: Array<{ name: string; count: number }>;
  activeCollection: string;
  onSelectCollection: (name: string) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  onCreateCollection?: (name: string) => void;
  totalCount: number;
}

export function BatchMaterialsCollectionBar({
  collections,
  activeCollection,
  onSelectCollection,
  favoritesOnly,
  onToggleFavoritesOnly,
  onCreateCollection,
  totalCount,
}: BatchMaterialsCollectionBarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    onCreateCollection?.(newCollectionName.trim());
    onSelectCollection(newCollectionName.trim());
    setNewCollectionName("");
    setIsCreating(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-surface border border-border rounded-2xl p-2.5 shadow-sm">
      {/* Collection Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => onSelectCollection("all")}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeCollection === "all"
              ? "bg-primary text-white shadow-sm"
              : "bg-background text-text-secondary hover:text-text-primary hover:bg-surface border border-border/80"
          }`}
        >
          <span>All Resources</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
              activeCollection === "all"
                ? "bg-white/20 text-white"
                : "bg-surface text-text-muted border border-border"
            }`}
          >
            {totalCount}
          </span>
        </button>

        {collections.map((col) => {
          const isActive = activeCollection === col.name;
          return (
            <button
              key={col.name}
              onClick={() => onSelectCollection(col.name)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-background text-text-secondary hover:text-text-primary hover:bg-surface border border-border/80"
              }`}
            >
              <Folder className="w-3.5 h-3.5 opacity-80" />
              <span>{col.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-surface text-text-muted border border-border"
                }`}
              >
                {col.count}
              </span>
            </button>
          );
        })}

        {/* Inline Collection Create Trigger */}
        {isCreating ? (
          <form
            onSubmit={handleCreate}
            className="inline-flex items-center gap-1 bg-background border border-primary/50 rounded-xl px-2 py-1 shadow-sm"
          >
            <input
              type="text"
              autoFocus
              placeholder="Collection name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="bg-transparent text-xs text-text-primary font-semibold outline-none px-1.5 w-32"
            />
            <button
              type="submit"
              className="p-1 rounded-lg bg-primary text-white hover:bg-primary/90"
              title="Save collection"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary"
            >
              <X className="w-3 h-3" />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-border text-xs font-semibold text-text-muted hover:text-text-primary hover:border-primary/50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Collection</span>
          </button>
        )}
      </div>

      {/* Right side actions: Favorites Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFavoritesOnly}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            favoritesOnly
              ? "bg-amber-500/10 text-amber-700 border-amber-300 shadow-sm"
              : "bg-background text-text-secondary border-border/80 hover:text-text-primary"
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              favoritesOnly ? "fill-amber-500 text-amber-500" : ""
            }`}
          />
          <span>Favorites Only</span>
        </button>
      </div>
    </div>
  );
}
