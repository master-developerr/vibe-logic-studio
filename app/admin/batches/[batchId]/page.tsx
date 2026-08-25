"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BatchWorkspaceRootPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.batchId) {
      router.replace(`/admin/batches/${params.batchId}/overview`);
    }
  }, [params.batchId, router]);

  return null;
}
