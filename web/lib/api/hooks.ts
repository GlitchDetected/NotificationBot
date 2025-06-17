import { cacheOptions, getData } from "@/lib/api";
import { useState, useEffect } from "react";

interface ApiError {
  status: number;
  message: string;
}

export function useApi<T>(url: string, enabled?: boolean) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return; // Don't fetch if not enabled

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getData<T | ApiError>(url);

        // If the result is an error response (ApiError), handle it
        if ((result as ApiError).message) {
          setError((result as ApiError).message);
          setData(undefined); // Clear any previous data
        } else {
          setData(result as T); // Set the fetched data
          setError(undefined); // Clear any previous errors
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, enabled]);

  return { data, isLoading, error };
}
