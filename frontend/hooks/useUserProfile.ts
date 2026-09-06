"use client";

import { useCallback, useEffect, useState } from "react";

import { userService } from "@/services/def/UserService";

import type { IUserPublicProfile } from "@/domain/meta/IUserPublicProfile";
import type { TNullable } from "@/domain/type/TCommon";

export function useUserProfile(id: string, errorDescription: string) {
  const [profile, setProfile] = useState<TNullable<IUserPublicProfile>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TNullable<string>>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    userService
      .publicProfile(id)
      .then((res) => {
        if (!alive) return;
        if (res.data) setProfile(res.data);
        else setError(errorDescription);
      })
      .catch(() => {
        if (alive) setError(errorDescription);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id, attempt, errorDescription]);

  const reload = useCallback(() => {
    setProfile(null);
    setError(null);
    setAttempt((a) => a + 1);
  }, []);

  return { profile, loading, error, reload };
}
