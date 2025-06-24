"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
    const [loading, setLoading] = useState(true);
  
      useEffect(() => {
    (async () => {
      setLoading(true);
  
      setLoading(false);
    })();
  }, []);
  
  
      if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
      );
    }

  return new Array(20).fill(null).map((_, i) => (
    <div
      key={"loading..." + i}
      className="mb-4 rounded-md p-3 flex items-center dark:bg-greybackground bg-greybackground-100 w-full"
    >
      <Skeleton className="rounded-full w-12 h-12 mr-3" />

      <div className="flex flex-col gap-2 mt-0.5">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>

      <Skeleton className="ml-auto h-8 w-14 rounded-lg" />

      <Skeleton className="rounded-full w-12 h-12 ml-3" />
    </div>
  ));
}
