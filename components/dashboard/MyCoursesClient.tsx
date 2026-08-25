"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Users, ImageIcon } from "lucide-react";

type CourseStatus = "ACTIVE" | "IN PROGRESS" | "COMPLETED" | "AVAILABLE";

interface BaseCourse {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImageUrl?: string;
  instructorName?: string;
}

interface EnrolledCourse extends BaseCourse {
  enrollmentId: string;
  progress: number;
  batch: {
    id: string;
    title: string;
  };
  status: "ACTIVE" | "IN PROGRESS" | "COMPLETED";
}

interface AvailableCourse extends BaseCourse {
  status: "AVAILABLE";
  price: number;
}

type CourseItem = EnrolledCourse | AvailableCourse;

export function MyCoursesClient({ 
  enrollments, 
  availableCourses 
}: { 
  enrollments: any[]; 
  availableCourses: any[]; 
}) {
  const [activeTab, setActiveTab] = useState("All Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const tabs = ["All Courses", "Active", "In Progress", "Completed", "Available"];

  // Normalize data
  const normalizedEnrollments: EnrolledCourse[] = enrollments.map(e => {
    let status: "ACTIVE" | "IN PROGRESS" | "COMPLETED" = "ACTIVE";
    if (e.progress === 100) status = "COMPLETED";
    else if (e.progress > 0) status = "IN PROGRESS";
    
    return {
      id: e.course.id,
      slug: e.course.slug,
      title: e.course.title,
      category: e.course.category || "GENERAL",
      description: e.course.description || "",
      coverImageUrl: e.course.coverImageUrl,
      instructorName: e.course.instructorName,
      enrollmentId: e.enrollmentId,
      progress: e.progress || 0,
      batch: e.batch,
      status,
    };
  });

  const normalizedAvailable: AvailableCourse[] = availableCourses.map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    category: c.category || "GENERAL",
    description: c.description || "",
    coverImageUrl: c.coverImageUrl,
    instructorName: c.instructorName,
    price: c.price || 0,
    status: "AVAILABLE",
  }));

  const allItems: CourseItem[] = [...normalizedEnrollments, ...normalizedAvailable];

  // Filter and search
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Tab filter
      if (activeTab !== "All Courses") {
        if (activeTab === "Available" && item.status !== "AVAILABLE") return false;
        if (activeTab === "Completed" && item.status !== "COMPLETED") return false;
        if (activeTab === "In Progress" && item.status !== "IN PROGRESS") return false;
        if (activeTab === "Active" && item.status !== "ACTIVE") return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesInstructor = item.instructorName?.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesInstructor && !matchesCategory) return false;
      }
      
      return true;
    });
  }, [allItems, activeTab, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle Tab Change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getBadgeColor = (status: CourseStatus) => {
    switch (status) {
      case "COMPLETED": return "bg-[#10B981] text-white";
      case "AVAILABLE": return "bg-gray-100 text-gray-700";
      case "ACTIVE":
      case "IN PROGRESS":
      default:
        return "bg-[#FF5722] text-white";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen font-sans bg-[#FBFBFB]">
      <div className="mb-8 mt-2">
        <h1 className="text-[32px] font-bold text-gray-900 tracking-tight mb-2">My Courses</h1>
        <p className="text-gray-500 text-[15px]">Manage your learning journey and track your progress across all enrolled programs.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "bg-gray-900 text-white shadow-sm" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-[320px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-colors shadow-sm"
            placeholder="Search courses, instructors, skills..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="bg-white rounded-[24px] p-2 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col group h-full">
              {/* Image Header */}
              <div className="h-44 relative bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-[16px] rounded-b-md">
                {item.coverImageUrl ? (
                  <img src={item.coverImageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-gray-800 shadow-sm border border-gray-100/50">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${getBadgeColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pt-5 pb-4 flex flex-col flex-1">
                <h3 className="text-[17px] font-bold text-gray-900 leading-[1.3] mb-2 line-clamp-2 h-[44px]">{item.title}</h3>
                <p className="text-[13px] text-gray-500 line-clamp-2 mb-5 leading-relaxed h-[40px]">{item.description}</p>
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-500 mb-6 uppercase tracking-wider">
                  {item.instructorName && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[9px] font-bold shrink-0">
                        {item.instructorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="truncate normal-case text-[12px] font-medium text-gray-700">{item.instructorName}</span>
                    </div>
                  )}
                  {item.status !== "AVAILABLE" && (item as EnrolledCourse).batch && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate normal-case text-[12px] font-medium text-gray-700">Batch: {(item as EnrolledCourse).batch.title}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  {/* Progress or Pricing */}
                  {item.status !== "AVAILABLE" ? (
                    <div className="mb-5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Course Progress</span>
                        <span className={`text-[11px] font-bold ${item.status === "COMPLETED" ? "text-[#10B981]" : "text-[#FF5722]"}`}>
                          {(item as EnrolledCourse).progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${item.status === "COMPLETED" ? "bg-[#10B981]" : "bg-[#FF5722]"}`}
                          style={{ width: `${(item as EnrolledCourse).progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-5 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Enrollment Status</p>
                        <p className="text-sm font-bold text-gray-900">Registration Open</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 leading-none">{(item as AvailableCourse).price > 0 ? `$${(item as AvailableCourse).price}` : "Free"}</p>
                        <p className="text-[10px] text-gray-500 mt-1">for enrolled students</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {item.status === "COMPLETED" ? (
                    <div className="flex items-center gap-3">
                      {(() => {
                        const batchId = (item as any).batch?.id || (item as any).batch?._id || (item as any).batchId;
                        const href = batchId ? `/dashboard/courses/${batchId}/overview` : "/dashboard/courses";
                        return (
                          <Link 
                            href={href}
                            className="flex-1 inline-flex justify-center items-center py-3 px-4 rounded-[12px] text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            View Course
                          </Link>
                        );
                      })()}
                      <button className="flex-1 inline-flex justify-center items-center py-3 px-4 rounded-[12px] text-sm font-semibold text-[#FF5722] bg-white border border-[#FF5722] hover:bg-orange-50 transition-colors">
                        Certificate
                      </button>
                    </div>
                  ) : item.status === "AVAILABLE" ? (
                    <Link
                      href={`/course/${item.slug}`}
                      className="w-full inline-flex justify-center items-center py-3 px-4 rounded-[12px] text-sm font-semibold text-white bg-gray-900 hover:bg-black transition-colors shadow-sm"
                    >
                      Request Enrollment +
                    </Link>
                  ) : (
                    (() => {
                      const batchId = (item as any).batch?.id || (item as any).batch?._id || (item as any).batchId;
                      const href = batchId ? `/dashboard/courses/${batchId}/overview` : "/dashboard/courses";
                      return (
                        <Link
                          href={href}
                          className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-[12px] text-sm font-semibold text-white bg-[#FF5722] hover:bg-[#F4511E] transition-colors shadow-sm shadow-orange-500/20"
                        >
                          {item.status === "ACTIVE" ? "Resume Lesson" : "Continue Learning"}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      );
                    })()
                  )}


                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-200 pb-12">
          <p className="text-sm text-gray-500 font-medium">
            Showing {Math.min(filteredItems.length, (currentPage - 1) * itemsPerPage + 1)} of {filteredItems.length} courses
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-[10px] border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 flex items-center justify-center rounded-[10px] text-sm font-bold transition-colors ${
                  currentPage === i + 1 
                    ? "bg-gray-900 text-white" 
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-[10px] border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
