"use client";

import { useRouter } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { useUserStore } from "@/app/hooks/use-user-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { LogOut, Settings } from "lucide-react";
import { axiosAuth } from "@/lib/axiosAuth";
import { RenderAvatar } from "../render-avatar";
import { useModalStore } from "@/app/hooks/use-modal-store";
import { useSocketContext } from "../providers/socket-provider";

interface ServerProps {
  id: string;
  name: string;
  image: string;
}

const NavigationSidebar = () => {
  const router = useRouter();
  const { socket } = useSocketContext();
  const { onOpen } = useModalStore();
  const { profile, setToken } = useUserStore();
  const [servers, setServer] = useState<ServerProps[]>([]);

  const fetchServers = useCallback(async () => {
    const res = await axiosAuth.get("/server/findMany");
    if (res?.data) {
      setServer(res.data);
    }
  }, []);

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  const handleLogout = async () => {
    const res = await axiosAuth.get("/auth/logout");
    if (res?.data) {
      setToken({
        accessToken: "",
        refreshToken: "",
      });
      localStorage.setItem("access_token", "");
      localStorage.setItem("refresh_token", "");
      socket?.close();
      router.refresh();
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center h-full  text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="bg-zinc-300 dark:bg-zinc-700 h-[2px] w-10 mx-auto rounded-md" />
      <ScrollArea className="flex w-full flex-1">
        {servers?.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.image}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <RenderAvatar
                userId={profile?.id}
                photo={profile?.photo}
                name={profile?.name}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white dark:bg-black">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-center">
                <RenderAvatar
                  userId={profile?.id}
                  photo={profile?.photo}
                  name={profile?.name}
                />
                <Label>{profile?.name}</Label>
              </div>
              <div
                className="flex p-2 hover:bg-zinc-600 rounded cursor-pointer items-center"
                onClick={() => {
                  onOpen("updateProfile");
                }}
              >
                <Settings size={18} className="mr-7 text-zinc-400" />
                <p className="text-sm text-zinc-400">Manage Account</p>
              </div>
              <div
                className="flex p-2 hover:bg-zinc-600 rounded cursor-pointer items-center"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-7 text-zinc-400" />
                <p className="text-sm text-zinc-400">Sign out</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default NavigationSidebar;
