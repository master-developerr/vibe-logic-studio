import React from "react";
import { ReviewsClient } from "@/components/admin/reviews/ReviewsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews & Testimonials | VibeLogic Studio",
  description: "Moderate student feedback and curate platform testimonials.",
};

export default function AdminReviewsPage() {
  return <ReviewsClient />;
}
