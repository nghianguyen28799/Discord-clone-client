"use client";
import ServerSidebar from "@/components/server/server-sidebar";
import { axiosAuth } from "@/lib/axiosAuth";
import { ServerType } from "@/lib/type/serverType";
import { redirect, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const ServerIdLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [serverData, setServerData] = useState<ServerType | null>(null);

  const fetchServer = useCallback(async () => {
    const response = await axiosAuth.get(`/server/find/${params.serverId}`);

    if (!response?.data) {
      const res = await axiosAuth.patch("/server/join", {
        id: params.serverId,
      });

      if (res?.data) {
        router.refresh();
        return window.location.reload();
      }
    }

    setIsMounted(true);
    setServerData(response.data);
  }, [params.serverId, router]);

  useEffect(() => {
    fetchServer();
  }, [fetchServer]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="!hidden md:!flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} serverData={serverData} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
