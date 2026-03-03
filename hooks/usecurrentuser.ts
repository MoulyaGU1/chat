"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function useCurrentUser() {
  const { user: clerkUser, isLoaded } = useUser();

  // ✅ Correct API usage
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );

  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (clerkUser && convexUser === null) {
      createUser({
        clerkId: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || "User",
        email:
          clerkUser.primaryEmailAddress?.emailAddress || "",
        image: clerkUser.imageUrl || "",
      });
    }
  }, [clerkUser, convexUser, createUser]);

  return {
    clerkUser,
    user: convexUser,
    isLoading: !isLoaded || (clerkUser && convexUser === undefined),
  };
}