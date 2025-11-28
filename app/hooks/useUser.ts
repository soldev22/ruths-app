"use client";

import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    }

    check();
  }, []);

  return { user, loading };
}
