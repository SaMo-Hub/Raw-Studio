"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServicePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to raw-sport page
    router.push("/raw-sport");
  }, [router]);

  return null;
}
