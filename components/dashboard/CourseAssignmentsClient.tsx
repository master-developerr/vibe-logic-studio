"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";

type Assignment = any;
type Submission = any;

interface CourseAssignmentsClientProps {
  batchId: string;
  assignments: Assignment[];
  submissions: Submission[];
}

type FilterType = "All" | "Pending" | "Submitted" | "Graded" | "Overdue";

export default function CourseAssignmentsClient({
  batchId,
  assignments,
  submissions,
}: CourseAssignmentsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const now = new Date().getTime();

  // Combine assignment data with submission data to get dynamic status
  const enrichedAssignments = assignments.map((assignment) => {
    const submission = submissions.find(
      (s) => s.assignmentId === assignment._id
    );
    
    const dueDate = new Date(assignment.dueDate).getTime();
    const isPastDue = dueDate < now;

    let computedStatus: FilterType = "Pending";
    
    if (submission) {
      if (submission.status === "Graded") {
        computedStatus = "Graded";
      } else {
        computedStatus = "Submitted";
      }
    } else {
      if (isPastDue) {
        computedStatus = "Overdue";
      } else {
        computedStatus = "Pending"; // or "Not Started" but "Pending" fits the filter
      }
    }

    return {
      ...assignment,
      computedStatus,
      submission,
    };
  });

  // Filter logic
  const filteredAssignments = enrichedAssignments.filter((assignment) => {
    if (activeFilter === "All") return true;
    return assignment.computedStatus === activeFilter;
  });

  return (
    <div className="font-sans max-w-full">
      <div className="mb-6">
        <h1 className="text-4xl md:text-[40px] font-extrabold text-gray-900 leading-tight mb-3 tracking-tight">
          Assignments
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
          Track your coursework, submissions and deadlines.
        </p>
      </div>

      <div className="flex items-center justify-start gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(["All", "Pending", "Submitted", "Graded", "Overdue"] as FilterType[]).map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors border ${
                activeFilter === filter
                  ? "bg-[#FF5A28] text-white border-[#FF5A28]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {filter}
            </button>
          )
        )}
      </div>

      <div className="flex flex-col gap-5 w-full">
        {filteredAssignments.length === 0 ? (
          <div className="py-12 flex flex-col items-start">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No assignments yet
            </h3>
            <p className="text-gray-500 max-w-md">
              Your instructor hasn't published any assignments for this course.
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const status = assignment.computedStatus;
            
            // Map status to visual presentation
            let statusColor = "bg-gray-400"; // Default
            let pillClass = "text-gray-600 border-gray-200 bg-white";
            let pillLabel = "NOT STARTED";
            let buttonLabel = "Open Assignment";
            let buttonIcon = <ArrowRight className="w-4 h-4 ml-1.5" />;
            let buttonClass = "bg-[#FF5A28] hover:bg-[#E0491C] text-white border-transparent";
            let actionHref = `/dashboard/courses/${batchId}/assignments/${assignment._id}`;
            let dueText = `Due ${new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${new Date(assignment.dueDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

            if (status === "Overdue") {
              statusColor = "bg-red-500";
              pillClass = "text-red-600 border-red-100 bg-red-50";
              pillLabel = "OVERDUE";
            } else if (status === "Pending") {
              statusColor = "bg-[#FF5A28]";
              pillClass = "text-[#FF5A28] border-orange-100 bg-orange-50";
              pillLabel = "IN PROGRESS";
            } else if (status === "Submitted") {
              statusColor = "bg-blue-500";
              pillClass = "text-blue-600 border-blue-100 bg-blue-50";
              pillLabel = "SUBMITTED";
              buttonLabel = "View Submission";
              buttonIcon = <FileText className="w-4 h-4 ml-1.5" />;
              buttonClass = "bg-blue-600 hover:bg-blue-700 text-white border-transparent";
              if (assignment.submission?.submittedAt) {
                 dueText = `Sent ${new Date(assignment.submission.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${new Date(assignment.submission.submittedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
              }
            } else if (status === "Graded") {
              statusColor = "bg-emerald-500";
              pillClass = "text-emerald-600 border-emerald-100 bg-emerald-50";
              pillLabel = "GRADED";
              buttonLabel = "View Results";
              buttonIcon = <ArrowUpRight className="w-4 h-4 ml-1.5" />;
              buttonClass = "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent";
              if (assignment.submission?.submittedAt) {
                 dueText = `Submitted ${new Date(assignment.submission.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
              }
            }

            return (
              <div
                key={assignment._id}
                className="bg-white border border-[#E6E2DC] rounded-[12px] p-5 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 flex flex-col items-start">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <span
                      className={`uppercase text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${pillClass}`}
                    >
                      {pillLabel}
                    </span>
                    <span className="text-[13px] font-medium text-gray-500 tracking-tight">
                      {dueText}
                    </span>
                    {assignment.moduleTitle && (
                      <>
                        <span className="text-gray-300 mx-1">•</span>
                        <span className="text-[13px] font-medium text-gray-500">
                          {assignment.moduleTitle}
                        </span>
                      </>
                    )}
                    {assignment.totalPoints && (
                      <>
                        <span className="text-gray-300 mx-1">•</span>
                        <span className="text-[13px] font-medium text-gray-500">
                          {assignment.totalPoints} pts
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-[18px] font-bold text-gray-900 mb-1.5 leading-tight">
                    {assignment.title}
                  </h3>
                  
                  <p className="text-[14px] text-gray-500 max-w-[80%] leading-relaxed line-clamp-2">
                    {assignment.description}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                  {status === "Graded" && assignment.submission?.grade !== undefined && (
                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
                        Grade
                      </span>
                      <div className="text-[20px] font-bold text-gray-900 flex items-baseline gap-1">
                        <span className="text-emerald-600">{assignment.submission.grade}</span>
                        <span className="text-[14px] text-gray-400 font-semibold">/{assignment.totalPoints || 100}</span>
                      </div>
                    </div>
                  )}
                  
                  <Link
                    href={actionHref}
                    className={`inline-flex items-center justify-center px-4 py-2 text-[13px] font-bold rounded-lg transition-colors border whitespace-nowrap ${buttonClass}`}
                  >
                    {buttonLabel}
                    {buttonIcon}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
