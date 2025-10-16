"use client";

import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";

export const LogoutButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
            },
          },
        })
      }
    >
      Logout
    </Button>
  );
};
