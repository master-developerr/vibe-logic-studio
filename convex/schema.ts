import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.string(), // "admin" | "student" | "instructor" | "superadmin" | "staff"
    avatarUrl: v.string(),
    phone: v.optional(v.string()),
    createdAt: v.number(),
    // Extended Enterprise User Management Fields
    permissions: v.optional(v.array(v.string())),
    adminNotes: v.optional(
      v.array(
        v.object({
          text: v.string(),
          authorId: v.string(),
          authorName: v.string(),
          createdAt: v.number(),
        })
      )
    ),
    roleHistory: v.optional(
      v.array(
        v.object({
          oldRole: v.string(),
          newRole: v.string(),
          changedBy: v.string(),
          reason: v.string(),
          date: v.number(),
        })
      )
    ),
    accountStatus: v.optional(v.string()), // "active" | "suspended" | "locked"
    security: v.optional(
      v.object({
        lastLogin: v.number(),
        ip: v.string(),
        device: v.string(),
        mfaEnabled: v.boolean(),
        verificationStatus: v.string(), // "Verified" | "Unverified"
      })
    ),
  }).index("by_clerk_id", ["clerkId"]),

  courses: defineTable({
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    price: v.number(),
    coverImageId: v.string(),
    coverImageUrl: v.string(),
    instructorName: v.string(),
    instructorRole: v.string(),
    instructorBio: v.string(),
    syllabus: v.array(v.string()),
    difficulty: v.optional(v.string()), // "Beginner" | "Intermediate" | "Advanced"
    duration: v.optional(v.string()), // e.g. "4 Weeks", "12 Modules"
    status: v.optional(v.string()), // "Published" | "Draft" | "Upcoming" | "Archived" | "Private" | "Enrollment Closed"
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_is_active", ["isActive"]),

  batches: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    capacity: v.number(),
    enrolledCount: v.number(),
    status: v.string(), // "upcoming" | "live" | "completed"
    whatsappLink: v.optional(v.string()),
    description: v.optional(v.string()),
    instructorName: v.optional(v.string()),
    timezone: v.optional(v.string()),
    enrollmentStatus: v.optional(v.string()), // "Running" | "Upcoming" | "Completed" | "Closed"
    allowWaitlist: v.optional(v.boolean()),
    googleMeetLink: v.optional(v.string()),
    discordLink: v.optional(v.string()),
    notionLink: v.optional(v.string()),
    extraLinks: v.optional(
      v.array(v.object({ title: v.string(), url: v.string() }))
    ),
    attendanceEnabled: v.optional(v.boolean()),
    assignmentsEnabled: v.optional(v.boolean()),
    certificatesEnabled: v.optional(v.boolean()),
    communityEnabled: v.optional(v.boolean()),
    aiTutorEnabled: v.optional(v.boolean()),
    sandboxEnabled: v.optional(v.boolean()),
    isArchived: v.optional(v.boolean()),
  }).index("by_course_id", ["courseId"]),

  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    batchId: v.id("batches"),
    paymentId: v.optional(v.id("payments")),
    status: v.string(), // "active" | "dropped" | "completed"
    progress: v.number(),
    enrolledAt: v.number(),
    notes: v.optional(v.string()),
    certificateStatus: v.optional(v.string()), // "Eligible" | "Issued" | "Pending" | "Downloaded"
    attendancePercentage: v.optional(v.number()),
    completedLessons: v.optional(v.array(v.id("studyMaterials"))),
  }).index("by_user_id", ["userId"])
    .index("by_course_id", ["courseId"])
    .index("by_batch_id", ["batchId"])
    .index("by_user_course_batch", ["userId", "courseId", "batchId"]),

  payments: defineTable({
    userId: v.id("users"),
    razorpayOrderId: v.string(),
    amount: v.number(),
    status: v.string(), // "pending" | "successful" | "failed" | "refunded"
    createdAt: v.number(),
    // Extended SaaS Finance & Enterprise Transaction Fields
    currency: v.optional(v.string()), // "USD" | "INR" | "EUR" | "GBP"
    gateway: v.optional(v.string()), // "Razorpay" | "Stripe" | "Paddle" | "Wire"
    paymentMethod: v.optional(v.string()), // "Card (•••• 4242)" | "UPI" | "NetBanking" | "Wire Transfer" | "Apple Pay"
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    courseTitle: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    // Optional during the zero-downtime migration. All new checkout mutations
    // write a batch ID, while historical records remain readable.
    batchId: v.optional(v.id("batches")),
    invoiceNumber: v.optional(v.string()), // e.g. "INV-2026-0842"
    invoiceUrl: v.optional(v.string()),
    taxAmount: v.optional(v.number()), // e.g. GST / VAT
    couponCode: v.optional(v.string()), // e.g. "LAUNCH25"
    discountAmount: v.optional(v.number()),
    netAmount: v.optional(v.number()),
    subscriptionId: v.optional(v.string()), // e.g. "sub_1Q8..."
    subscriptionPlan: v.optional(v.string()), // "Monthly Pro" | "Annual All-Access" | "One-Time Cohort"
    subscriptionStatus: v.optional(v.string()), // "Active" | "Past Due" | "Canceled" | "Trialing"
    renewalDate: v.optional(v.number()),
    refundStatus: v.optional(v.string()), // "None" | "Requested" | "Approved" | "Processed" | "Rejected"
    refundAmount: v.optional(v.number()),
    refundReason: v.optional(v.string()),
    errorCode: v.optional(v.string()), // "ERR_INSUFFICIENT_FUNDS" | "CARD_EXPIRED" | "GATEWAY_TIMEOUT"
    errorMessage: v.optional(v.string()),
    payoutStatus: v.optional(v.string()), // "Pending" | "Settled" | "In Transit"
  }).index("by_user_id", ["userId"])
    .index("by_user_course_batch", ["userId", "courseId", "batchId"]),

  reviews: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    rating: v.number(),
    content: v.string(),
    isApproved: v.boolean(),
    isFeatured: v.boolean(),
    // Extended Review & Moderation Fields
    createdAt: v.optional(v.number()),
    moderationStatus: v.optional(v.string()), // "Pending" | "Approved" | "Rejected" | "Hidden" | "Flagged"
    verificationStatus: v.optional(v.string()), // "Verified Student" | "Unverified"
    helpfulVotes: v.optional(v.number()),
    sentimentScore: v.optional(v.string()), // "Positive" | "Neutral" | "Negative"
    isPinned: v.optional(v.boolean()),
    reportedReason: v.optional(v.string()),
  }).index("by_course_id", ["courseId"]),

  studyMaterials: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    type: v.string(), // "pdf" | "video" | "link"
    fileUrl: v.string(),
    order: v.number(),
    // Extended CMS Resource Fields
    collection: v.optional(v.string()), // e.g. "Module 1: Foundations", "Day 1: Intro to AI", "Assignments", "Resources"
    fileSize: v.optional(v.string()), // e.g. "2.4 MB"
    fileFormat: v.optional(v.string()), // e.g. "PDF", "DOCX", "PPTX", "ZIP", "MP4", "CODE", "LINK", "IMG"
    downloads: v.optional(v.number()), // e.g. 1248
    visibility: v.optional(v.string()), // e.g. "Public", "Students Only", "Draft", "Archived"
    description: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    isFavorite: v.optional(v.boolean()),
  }).index("by_course_id", ["courseId"]),

  liveClasses: defineTable({
    batchId: v.id("batches"),
    title: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    meetingLink: v.string(),
    recordingUrl: v.optional(v.string()),
    // Extended Recording Replay & Archive Fields
    duration: v.optional(v.string()), // e.g. "02:14:32"
    moduleTitle: v.optional(v.string()), // e.g. "Module 1"
    instructorName: v.optional(v.string()), // e.g. "Markus Keren"
    views: v.optional(v.number()),
    completionRate: v.optional(v.number()), // 0-100 percentage
    status: v.optional(v.string()), // "Published" | "Draft" | "Processing" | "Scheduled"
    visibility: v.optional(v.string()), // "Public to Batch" | "Private" | "Instructors Only"
    videoSource: v.optional(v.string()), // "YouTube" | "Vimeo" | "UploadThing" | "Google Drive"
    youtubeVideoId: v.optional(v.string()),
    description: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
          type: v.string(), // "pdf" | "link" | "slide"
        })
      )
    ),
  }).index("by_batch_id", ["batchId"]),

  announcements: defineTable({
    batchId: v.optional(v.id("batches")), // null = platform wide
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    status: v.optional(v.string()), // "Draft" | "Scheduled" | "Published" | "Archived" | "Failed" | "Expired"
    targetAudience: v.optional(v.string()), // "Entire Batch" | "Specific Students" | "Students with Pending Payments" | "Students with Low Attendance" | "Students Missing Assignments" | "Instructors"
    scheduledAt: v.optional(v.number()),
    isPinned: v.optional(v.boolean()),
    allowComments: v.optional(v.boolean()),
    authorName: v.optional(v.string()),
    authorRole: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          id: v.optional(v.string()),
          type: v.string(), // "file" | "material" | "recording" | "link"
          title: v.string(),
          url: v.string(),
        })
      )
    ),
    broadcastChannels: v.optional(
      v.object({
        inApp: v.boolean(),
        whatsapp: v.boolean(),
        email: v.boolean(),
        push: v.boolean(),
      })
    ),
    engagement: v.optional(
      v.object({
        views: v.number(),
        commentsCount: v.number(),
        deliveredCount: v.number(),
        totalReach: v.number(),
      })
    ),
  }).index("by_batch_id", ["batchId"]),

  landingPage: defineTable({
    section: v.string(), // "hero" | "banner" | "features"
    content: v.string(), // JSON stringified or raw text
    isVisible: v.boolean(),
  }),

  media: defineTable({
    fileName: v.string(),
    fileUrl: v.string(),
    uploadedBy: v.id("users"), // admin user id
  }),

  assignments: defineTable({
    courseId: v.id("courses"),
    batchId: v.id("batches"),
    title: v.string(),
    description: v.string(),
    moduleTitle: v.optional(v.string()), // Associated module/collection
    dueDate: v.number(),
    status: v.string(), // "Published" | "Draft" | "Archived"
    totalPoints: v.optional(v.number()),
    attachments: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
        })
      )
    ),
    createdAt: v.number(),
  }).index("by_batch_id", ["batchId"])
    .index("by_course_id", ["courseId"]),

  submissions: defineTable({
    assignmentId: v.id("assignments"),
    userId: v.id("users"),
    batchId: v.id("batches"),
    content: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          title: v.string(),
          url: v.string(),
        })
      )
    ),
    status: v.string(), // "Submitted" | "Graded" | "Late"
    submittedAt: v.number(),
    grade: v.optional(v.number()),
    feedback: v.optional(v.string()),
    gradedAt: v.optional(v.number()),
    gradedBy: v.optional(v.id("users")),
  }).index("by_assignment_id", ["assignmentId"])
    .index("by_user_id", ["userId"])
    .index("by_batch_id", ["batchId"]),

  activities: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    batchId: v.id("batches"),
    type: v.string(), // "Lesson Completed", "Recording Watched", "Assignment Submitted", "Material Downloaded", "Live Class Attended"
    title: v.string(), // e.g. "Completed: Intro to AI"
    timestamp: v.number(),
    resourceId: v.optional(v.string()), // ID of the related material/class/assignment
  }).index("by_user_id", ["userId"])
    .index("by_batch_id", ["batchId"]),

  recordingProgress: defineTable({
    userId: v.id("users"),
    batchId: v.id("batches"),
    recordingId: v.id("liveClasses"),
    timestamp: v.number(), // The time in seconds where the user left off
    percentage: v.number(), // 0 to 100
    status: v.string(), // "Unwatched" | "Partially Watched" | "Completed"
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"])
    .index("by_batch_id", ["batchId"])
    .index("by_user_recording", ["userId", "recordingId"]),

  announcementReads: defineTable({
    announcementId: v.id("announcements"),
    userId: v.id("users"),
    batchId: v.optional(v.id("batches")),
    readAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_announcement", ["announcementId"])
    .index("by_user_announcement", ["userId", "announcementId"]),

  attendance: defineTable({
    userId: v.id("users"),
    batchId: v.id("batches"),
    liveClassId: v.id("liveClasses"),
    status: v.string(), // "Present" | "Absent" | "Late" | "Excused"
    attendanceSource: v.string(), // "live_join" | "recording_watch" | "manual_admin"
    markedAt: v.number(),
    notes: v.optional(v.string()),
  }).index("by_user_id", ["userId"])
    .index("by_batch_id", ["batchId"])
    .index("by_live_class_id", ["liveClassId"])
    .index("by_user_live_class", ["userId", "liveClassId"]),
});
