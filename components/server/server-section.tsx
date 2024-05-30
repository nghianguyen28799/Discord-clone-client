"use client";

import React from "react";
import ActionTooltip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModalStore } from "@/app/hooks/use-modal-store";
import { MemberRole } from "@/lib/type/memberType";
import { ChannelTypeEnum } from "@/lib/type/channelType";
import { ServerType } from "@/lib/type/serverType";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType: ChannelTypeEnum;
  server?: ServerType;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModalStore();
  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { server })}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
