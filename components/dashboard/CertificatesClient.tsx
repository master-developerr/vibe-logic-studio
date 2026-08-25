"use client";

import { useState } from "react";
import { Search, ChevronDown, Award, Download, Eye, AlertCircle, Clock, MoveRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Certificate = {
  id: string;
  courseTitle: string;
  batchTitle: string;
  status: string; // "Issued" | "Pending" | "Downloaded"
  issuedDate: number;
  certificateId: string;
  progress: number;
};

type CertificatesData = {
  certificates: Certificate[];
  earnedCount: number;
  pendingCount: number;
  coursesCompletedCount: number;
};

export function CertificatesClient({
  initialData,
  clerkId,
}: {
  initialData: CertificatesData | null;
  clerkId: string;
}) {
  const data = useQuery(api.student.getCertificatesData, {}) ?? initialData;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  if (!data) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Filter and Sort Logic
  const filteredCerts = data.certificates.filter((cert) => {
    const matchesSearch = cert.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || 
                          (statusFilter === "Earned" && (cert.status === "Issued" || cert.status === "Downloaded")) ||
                          (statusFilter === "Pending" && cert.status === "Pending");
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "Newest") return b.issuedDate - a.issuedDate;
    if (sortBy === "Oldest") return a.issuedDate - b.issuedDate;
    if (sortBy === "Course Name") return a.courseTitle.localeCompare(b.courseTitle);
    return 0;
  });

  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-[40px] leading-tight font-bold tracking-tight text-gray-900">
          Certificates
        </h1>
        <p className="text-gray-500 text-base max-w-2xl">
          View and manage the certificates you&apos;ve earned from VibeLogic Studio.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center h-[88px]">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Certificates Earned</p>
          <p className="text-2xl font-bold text-gray-900">{data.earnedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center h-[88px]">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Courses Completed</p>
          <p className="text-2xl font-bold text-gray-900">{data.coursesCompletedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center h-[88px]">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Certificates Pending</p>
          <p className="text-2xl font-bold text-gray-900">{data.pendingCount}</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <div className="flex items-center p-1 bg-gray-100 rounded-lg shrink-0">
            {["All", "Earned", "Pending"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  statusFilter === status
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow cursor-pointer"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Course Name">Course Name</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Certificate Preview (Visual Top Half) */}
            <div className="relative w-full aspect-[4/3] bg-gray-50 border-b border-gray-100 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-50" />
              
              {/* Fake Certificate Document Box */}
              <div className="relative w-full h-full bg-white border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center text-center">
                <div className="absolute inset-1 border border-orange-100/50 pointer-events-none" />
                
                <Award className={`w-8 h-8 mb-2 ${cert.status === "Pending" ? "text-gray-300" : "text-orange-500"}`} strokeWidth={1.5} />
                <h3 className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">VibeLogic Studio</h3>
                <h2 className="text-sm font-bold text-gray-900 mb-2">Certificate of Completion</h2>
                <p className="text-[11px] text-gray-500 leading-tight line-clamp-2 max-w-[80%]">{cert.courseTitle}</p>
                
                {cert.status === "Pending" && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold tracking-wider rounded-full shadow-lg">PENDING</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Bottom Half */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-[13px] text-gray-500 font-medium">Batch: {cert.batchTitle}</p>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-semibold flex items-center gap-1.5 ${
                    cert.status === "Pending" ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full" : "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                  }`}>
                    {cert.status === "Pending" ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      <Award className="w-3.5 h-3.5" />
                    )}
                    {cert.status === "Pending" ? "Pending" : "Earned"}
                  </span>
                </div>
                {cert.status !== "Pending" && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-500">Issued</span>
                    <span className="font-medium text-gray-900">{format(new Date(cert.issuedDate), "MMM dd, yyyy")}</span>
                  </div>
                )}
                {cert.status !== "Pending" && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-500">Cert ID</span>
                    <span className="font-mono text-gray-900">{cert.certificateId}</span>
                  </div>
                )}
                {cert.status === "Pending" && (
                  <div className="flex items-start gap-2 mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-[12px] text-gray-500 leading-tight">
                      Our team is preparing your official certificate of completion. Check back soon.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => cert.status !== "Pending" && setSelectedCert(cert)}
                  disabled={cert.status === "Pending"}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  disabled={cert.status === "Pending"}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Keep Learning Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200 p-8 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Award className="w-6 h-6 text-orange-500" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Learning!</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-[200px] leading-relaxed">
            Complete your next course to earn a new certificate and expand your skills.
          </p>
          <Link
            href="/dashboard/courses"
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-full shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:bg-orange-600 transition-all active:scale-95"
          >
            Browse Courses
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Empty State (if no certs and search query) */}
      {filteredCerts.length === 0 && searchQuery !== "" && (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-gray-200">
          <Search className="w-10 h-10 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No certificates found</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            We couldn't find any certificates matching "{searchQuery}". Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All");
            }}
            className="mt-6 text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Modal Overlay */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedCert(null)}
          />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-white">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Certificate Preview</h3>
                <p className="text-sm text-gray-500 font-medium">ID: {selectedCert.certificateId}</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button className="hidden sm:flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content - Big Fake Certificate */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-gray-50 flex items-center justify-center min-h-[400px]">
              <div className="w-full max-w-2xl aspect-[1.4/1] bg-white border border-gray-200 shadow-xl p-8 sm:p-12 flex flex-col relative overflow-hidden">
                {/* Decorative border */}
                <div className="absolute inset-4 border-2 border-orange-100 rounded-sm pointer-events-none" />
                <div className="absolute inset-[20px] border border-orange-50 rounded-sm pointer-events-none" />
                
                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-orange-300" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-orange-300" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-orange-300" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-orange-300" />

                <div className="flex-1 flex flex-col items-center text-center relative z-10">
                  <Award className="w-12 h-12 text-orange-500 mb-6" strokeWidth={1.5} />
                  <h4 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">VibeLogic Studio</h4>
                  <h2 className="text-2xl sm:text-4xl font-serif text-gray-900 mb-8 sm:mb-12">Certificate of Completion</h2>
                  
                  <p className="text-sm text-gray-500 italic mb-4">This certifies that</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-6 px-12">
                    Student Name
                  </p>
                  
                  <p className="text-sm text-gray-500 italic mb-2">has successfully completed</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mb-auto max-w-md">
                    {selectedCert.courseTitle}
                  </p>

                  <div className="w-full flex items-end justify-between mt-12 px-8">
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-1 pr-8">
                        {format(new Date(selectedCert.issuedDate), "MMMM dd, yyyy")}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Date Issued</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-1 pl-8">
                        {selectedCert.certificateId}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Certificate ID</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white border-t border-gray-100 sm:hidden">
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
