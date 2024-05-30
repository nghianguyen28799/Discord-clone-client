import React, { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";
import { ServerType } from "@/lib/type/serverType";
import { axiosAuth } from "@/lib/axiosAuth";
import { redirect } from "next/navigation";

interface MobileToggleProps {
  serverId: string;
}
const MobileToggle = ({ serverId }: MobileToggleProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [serverData, setServerData] = useState<ServerType | null>(null);

  const fetchServer = useCallback(async () => {
    const response = await axiosAuth.get(`/server/find/${serverId}`);

    if (!response?.data) {
      return redirect("/");
    }
    setIsMounted(true);
    setServerData(response.data);
  }, [serverId]);

  useEffect(() => {
    fetchServer();
  }, [fetchServer]);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} serverData={serverData} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
