export type CourseBatch = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  status: "upcoming" | "live" | "completed";
};

export type CourseReview = {
  id: string;
  name: string;
  role: string;
  rating: number;
  content: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  price: number;
  coverImageUrl: string;
  instructor: {
    name: string;
    role: string;
    bio: string;
  };
  syllabus: string[];
  batches: CourseBatch[];
  reviews: CourseReview[];
};

export const courseCategories = ["All", "Development", "AI", "Design", "Career"] as const;

export const mockCourses: Course[] = [
  {
    id: "course_ai-build-sprint",
    slug: "ai-build-sprint",
    title: "AI Build Sprint",
    category: "AI",
    description: "Build and ship seven practical web projects with an AI-first development workflow.",
    price: 999,
    coverImageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=85",
    instructor: { name: "Aarav Mehta", role: "Product engineer", bio: "Aarav helps early-career builders turn ideas into useful, production-ready web products." },
    syllabus: ["Set up an AI-native development workflow", "Build responsive React interfaces", "Model data with Convex", "Ship a complete capstone"],
    batches: [
      { id: "batch-ai-jul", title: "July evening cohort", startDate: "2026-07-29", endDate: "2026-08-04", capacity: 30, enrolledCount: 24, status: "upcoming" },
      { id: "batch-ai-aug", title: "August weekend cohort", startDate: "2026-08-15", endDate: "2026-08-21", capacity: 30, enrolledCount: 30, status: "upcoming" },
    ],
    reviews: [
      { id: "review-ai-1", name: "Mira Nair", role: "BBA student", rating: 5, content: "I went from a blank editor to a portfolio piece I was happy to share in a single week." },
      { id: "review-ai-2", name: "Nikhil Thomas", role: "Career switcher", rating: 5, content: "The structure made modern development feel practical instead of overwhelming." },
    ],
  },
  {
    id: "course-react-systems",
    slug: "react-component-systems",
    title: "React Component Systems",
    category: "Development",
    description: "Learn to design resilient interfaces, reusable components, and thoughtful interaction states.",
    price: 1499,
    coverImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85",
    instructor: { name: "Ishita Kapoor", role: "Frontend engineer", bio: "Ishita builds product interfaces and teaches teams how to turn visual systems into dependable code." },
    syllabus: ["Component boundaries and composition", "Accessible form patterns", "State design and data flow", "Polished UI states"],
    batches: [{ id: "batch-react-aug", title: "August weekday cohort", startDate: "2026-08-06", endDate: "2026-08-27", capacity: 24, enrolledCount: 16, status: "upcoming" }],
    reviews: [{ id: "review-react-1", name: "Tanvi Kulkarni", role: "Junior designer", rating: 5, content: "I finally understand why good components feel simple to use and maintain." }],
  },
  {
    id: "course-saas-foundations",
    slug: "saas-product-foundations",
    title: "SaaS Product Foundations",
    category: "Development",
    description: "Take a focused product from an idea to a complete, deployable web application.",
    price: 1999,
    coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    instructor: { name: "Rohan Bhat", role: "Indie product builder", bio: "Rohan has shipped client and independent products from first prototype to paying customers." },
    syllabus: ["Product scoping", "Authentication and data models", "Payments and enrollment flows", "Deployment and iteration"],
    batches: [{ id: "batch-saas-live", title: "Live builder cohort", startDate: "2026-07-22", endDate: "2026-08-19", capacity: 20, enrolledCount: 11, status: "live" }],
    reviews: [{ id: "review-saas-1", name: "Dev Malhotra", role: "Freelancer", rating: 5, content: "It connected every technical choice to a real product decision." }],
  },
  {
    id: "course-design-dev",
    slug: "design-for-developers",
    title: "Design for Developers",
    category: "Design",
    description: "Create interfaces with stronger hierarchy, systems thinking, and responsive detail.",
    price: 1299,
    coverImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=85",
    instructor: { name: "Kavya Shah", role: "Product designer", bio: "Kavya works at the boundary of visual systems, usability, and practical frontend implementation." },
    syllabus: ["Visual hierarchy", "Token-based design systems", "Responsive layout decisions", "Design critique and iteration"],
    batches: [{ id: "batch-design-sep", title: "September studio", startDate: "2026-09-03", endDate: "2026-09-17", capacity: 24, enrolledCount: 8, status: "upcoming" }],
    reviews: [{ id: "review-design-1", name: "Aditi Suri", role: "Frontend learner", rating: 5, content: "The lessons gave me a repeatable way to make interfaces feel considered." }],
  },
  {
    id: "course-ai-automation",
    slug: "ai-automation-workflows",
    title: "AI Automation Workflows",
    category: "AI",
    description: "Connect models, APIs, and automation patterns to work that actually needs doing.",
    price: 1799,
    coverImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    instructor: { name: "Rehan Ali", role: "Automation consultant", bio: "Rehan designs reliable automated workflows for teams that want less manual overhead." },
    syllabus: ["Workflow mapping", "Structured AI outputs", "API connections", "Error handling and review loops"],
    batches: [{ id: "batch-auto-aug", title: "August automation lab", startDate: "2026-08-22", endDate: "2026-09-05", capacity: 18, enrolledCount: 15, status: "upcoming" }],
    reviews: [{ id: "review-auto-1", name: "Samar Prakash", role: "Operations associate", rating: 5, content: "I left with workflows I could explain, maintain, and use right away." }],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return mockCourses.find((course) => course.slug === slug);
}

export function getAvailableBatches(course: Course): CourseBatch[] {
  return course.batches.filter((batch) => batch.status === "upcoming" || batch.status === "live");
}

export function getRemainingSeats(batch: CourseBatch): number {
  return Math.max(batch.capacity - batch.enrolledCount, 0);
}
