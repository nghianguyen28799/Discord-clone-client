"use client";

import { useUserStore } from "@/app/hooks/use-user-store";
// import "@livekit/components-styles";
// import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { profile } = useUserStore();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!profile?.name) return;

    const name = `${profile?.name}`;

    (async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [chatId, profile?.name]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text">Loading...</p>
      </div>
    );
  }
  return null;
//   return (
//     // eslint-disable-next-line react/jsx-no-undef
//     <LiveKitRoom
//       video={video}
//       audio={audio}
//       token={token}
//       connect={true}
//       serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
//       // Use the default LiveKit theme for nice styles.
//       data-lk-theme="default"
//     >
//       <VideoConference />
//     </LiveKitRoom>
//   );
};
