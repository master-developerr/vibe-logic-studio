import React from "react";
import { MessageSquare } from "lucide-react";

export default function BatchNotesPage() {
  return (
    <div className="font-sans w-full">
      {/* PAGE HEADER */}
      <div className="flex flex-col items-start text-left mb-6">
        <h2 className="text-4xl md:text-[40px] font-extrabold text-text-primary leading-tight mb-3 tracking-tight">Class Notes</h2>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Access instructor notes, discussion highlights, and key takeaways from your classes.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-sm">
        <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4 opacity-80" strokeWidth={1.5} />
        <h3 className="text-xl font-bold text-text-primary mb-2">No Notes Available</h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Instructor notes and discussion highlights will appear here once they are published.
        </p>
      </div>
    </div>
  );
}
