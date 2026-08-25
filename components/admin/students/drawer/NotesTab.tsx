import React, { useState } from "react";
import { DrawerStudentRow } from "./types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function NotesTab({ student }: { student: DrawerStudentRow }) {
  const updateStudentEnterprise = useMutation(api.admin.updateStudentEnterprise);
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSubmittingNote(true);
    try {
      await updateStudentEnterprise({
        studentId: student.id as Id<"users">,
        newAdminNote: newNote.trim(),
      });
      setNewNote("");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingNote(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-1 px-1">
        <h3 className="text-[14px] font-bold text-text-primary tracking-tight">Private Administrator Notes</h3>
        <p className="text-[12px] text-text-muted">These notes are only visible to administrators and staff.</p>
      </div>

      <div className="flex-1 space-y-4">
        {student.adminNotes && student.adminNotes.length > 0 ? (
          <div className="relative border-l-2 border-border/60 pl-6 space-y-8 ml-2">
            {student.adminNotes.slice().reverse().map((n, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-border ring-4 ring-background" />
                <div className="bg-surface p-4 rounded-xl border border-border/60 hover:border-border transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[12px] font-bold text-text-primary">{n.authorName}</span>
                    <span className="text-[11px] text-text-muted font-medium bg-background px-2 py-0.5 rounded-full border border-border/40">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "numeric" })}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">{n.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted text-[13px] border border-dashed border-border/60 rounded-xl bg-surface/50">
            No private notes have been added for this student yet.
          </div>
        )}
      </div>

      <div className="space-y-3 pt-6 border-t border-border shrink-0">
        <textarea
          rows={4}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new private note..."
          className="w-full px-4 py-3 bg-surface border border-border/80 rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 resize-none transition-all"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddNote}
            disabled={submittingNote || !newNote.trim()}
            className="px-6 h-9 bg-primary text-white text-[13px] font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submittingNote ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
