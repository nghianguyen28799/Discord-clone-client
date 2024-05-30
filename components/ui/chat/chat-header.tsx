import React, { Fragment } from "react";
import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobile-toggle";
import { RenderAvatar } from "@/components/render-avatar";
// import SocketIndicator from "../socket-indicator";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  userId: string;
}

const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  userId,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <Fragment>
          <RenderAvatar
            userId={userId}
            photo={imageUrl}
            name={name}
            size={10}
          />
          <div className="ml-2" />
        </Fragment>
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {/* {type === "conversation" && (
          <ChatVideoButton />
        )} */}
      </div>
      {/* <SocketIndicator /> */}
    </div>
  );
};

export default ChatHeader;
