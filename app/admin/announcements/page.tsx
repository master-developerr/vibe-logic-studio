"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  batchTitle: string;
  createdAt: string;
};

const columns: ColumnDef<AnnouncementRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium text-text-primary">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "batchTitle",
    header: "Audience",
    cell: ({ row }) => {
      const isPlatformWide = row.original.batchTitle === "Platform Wide";
      return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${isPlatformWide ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {row.original.batchTitle}
        </span>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Posted On",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
];

export default function AdminAnnouncementsPage() {
  const announcements = useQuery(api.admin.getAllAnnouncements);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Announcements</h1>
          <p className="text-text-muted mt-2">Broadcast messages to specific batches or platform-wide.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      {announcements === undefined ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={announcements} />
      )}
    </div>
  );
}
