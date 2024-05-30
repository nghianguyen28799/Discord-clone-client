"use client";

import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { useParams, useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useUserStore } from "../hooks/use-user-store";
import { axiosAuth } from "@/lib/axiosAuth";
import { Loader2 } from "lucide-react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  let accessToken = "";
  let refreshToken = "";

  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("access_token") || "";
    refreshToken = localStorage.getItem("refresh_token") || "";
  }

  const params = useParams();
  const router = useRouter();
  const { setProfile } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);

  if (!accessToken) {
    router.push("/sign-in");
  }

  const fetchProfile = useCallback(async () => {
    const res = await axiosAuth.get("/user/me");

    if (res?.data) {
      setProfile(res.data);
      if (!params?.serverId) {
        const resServer = await axiosAuth.get("/server/findFirst");

        if (resServer?.data) {
          const serverId = resServer?.data.id;
          if (serverId) {
            router.push(`/servers/${serverId}`);
          }
        }
      }

      setTimeout(() => {
        setIsMounted(true);
      }, 1000);
    }
  }, [params?.serverId, router, setProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!isMounted)
    return (
      <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center gap-2">
        <p className="text-zinc-400">Processing</p>
        <Loader2 className="h-7 w-7 text-zinc-400 animate-spin my-4" />
      </div>
    );

  return (
    <div className="h-full">
      <div className="!hidden md:!flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
