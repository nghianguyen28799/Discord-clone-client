"use client";
import { MediaRoom } from "@/components/media-room";
import ChatHeader from "@/components/ui/chat/chat-header";
import ChatInput from "@/components/ui/chat/chat-input";
import ChatMessage from "@/components/ui/chat/chat-message";
import { axiosAuth } from "@/lib/axiosAuth";
import { ChannelType, ChannelTypeEnum } from "@/lib/type/channelType";
import { MemberType } from "@/lib/type/memberType";
import React, { useCallback, useEffect, useState } from "react";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelPage = ({ params }: ChannelIdPageProps) => {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [member, setMember] = useState<MemberType | null>(null);

  const fetchChannel = useCallback(async () => {
    const response = await axiosAuth.get(`/channel/${params.channelId}`);
    if (response?.data) {
      setChannel(response.data);
    }
  }, [params.channelId]);

  const fetchMember = useCallback(async () => {
    const response = await axiosAuth.get(`/member/${params.serverId}`);
    if (response?.data) {
      setMember(response?.data);
    }
  }, [params.serverId]);

  useEffect(() => {
    fetchChannel();
  }, [fetchChannel]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  if (!channel || !member) return null;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        userId={""}
        name={channel.name}
        serverId={params.serverId}
        type="channel"
      />
      {channel.type === ChannelTypeEnum.TEXT && (
        <>
          <ChatMessage
            name={channel.name}
            member={member}
            chatId={channel.id}
            type="channel"
            apiUrl="/messages"
            socketUrl="/messages/handler"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            apiUrl="/messages/handler"
            query={{ channelId: channel.id, serverId: channel.serverId }}
            type="channel"
          />
        </>
      )}
      {channel.type === ChannelTypeEnum.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelTypeEnum.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={false} />
      )}
    </div>
  );
};

export default ChannelPage;
