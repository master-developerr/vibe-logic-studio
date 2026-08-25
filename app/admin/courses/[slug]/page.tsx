"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminCourseDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const course = useQuery(api.courses.getBySlug, { slug });

  if (course === undefined) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (course === null) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-4">
        <p className="text-text-muted">Course not found</p>
        <Link href="/admin/courses">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <Link href="/admin/courses" className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-4 w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">{course.title}</h1>
            <p className="text-text-muted mt-2">Manage course details, batches, and reviews.</p>
          </div>
          <Button variant="outline">Edit Course</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Overview</h2>
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-sm text-text-muted">Description</span>
                <p className="text-text-primary mt-1">{course.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="text-sm text-text-muted">Category</span>
                  <p className="font-medium text-text-primary mt-1">{course.category}</p>
                </div>
                <div>
                  <span className="text-sm text-text-muted">Price</span>
                  <p className="font-medium text-text-primary mt-1">₹{course.price.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Batches</h2>
              <Button size="sm">Create Batch</Button>
            </div>
            
            {course.batches.length === 0 ? (
              <p className="text-text-muted text-sm py-4">No batches created yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {course.batches.map((batch: any) => (
                  <div key={batch._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <h4 className="font-medium text-text-primary">{batch.title}</h4>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 sm:mt-0">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-text-muted">Enrolled</span>
                        <span className="text-sm font-medium">{batch.enrolledCount} / {batch.capacity}</span>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        batch.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {batch.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Instructor</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                  {/* Avatar placeholder */}
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{course.instructor.name}</h4>
                  <p className="text-xs text-text-muted">{course.instructor.role}</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary mt-2 line-clamp-3">
                {course.instructor.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
