"use client";

import { useUserStore } from "@/app/hooks/use-user-store";
import ChatHeader from "@/components/ui/chat/chat-header";
import ChatInput from "@/components/ui/chat/chat-input";
import ChatMessage from "@/components/ui/chat/chat-message";
import { axiosAuth } from "@/lib/axiosAuth";
import { ConversationType } from "@/lib/type/conversationType";
import { MemberType } from "@/lib/type/memberType";
import { useRouter } from "next/navigation";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = ({ params, searchParams }: MemberIdPageProps) => {
  const { profile } = useUserStore();
  const router = useRouter();

  const [currentMember, setCurrentMember] = useState<MemberType | null>(null);
  const [conversation, setConversation] = useState<ConversationType | null>(
    null
  );

  const checkIsCurrentMember = useCallback(async () => {
    const res = await axiosAuth(`/member/${params.serverId}`);
    if (res?.data) {
      setCurrentMember(res.data);
    } else {
      router.push("/");
    }
  }, [params.serverId, router]);

  useEffect(() => {
    checkIsCurrentMember();
  }, [checkIsCurrentMember]);

  const findConversation = async (memberOneId: string, memberTwoId: string) => {
    const url = qs.stringifyUrl({
      url: `/conversation`,
      query: {
        memberOneId,
        memberTwoId,
      },
    });
    const res = await axiosAuth(url);
    if (res?.data) {
      return res?.data;
    }
    return null;
  };

  const getOrCreateConversation = useCallback(async () => {
    if (!currentMember?.id || !params.memberId) return null;
    let _conversation =
      (await findConversation(currentMember?.id, params.memberId)) ||
      (await findConversation(params.memberId, currentMember?.id));

    if (_conversation) {
      setConversation(_conversation);
      return;
    }

    const resCreate = await axiosAuth.post(`/conversation/create`, {
      memberOneId: currentMember?.id,
      memberTwoId: params.memberId,
    });
    if (resCreate?.data) {
      setConversation(resCreate?.data);
      return;
    }
  }, [currentMember?.id, params.memberId]);

  useEffect(() => {
    getOrCreateConversation();
  }, [getOrCreateConversation]);

  if (!profile) {
    return router.push("/sign-in");
  }

  if (!currentMember) {
    return null;
  }

  if (!conversation) {
    return null;
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.userId === profile.id ? memberTwo : memberOne;

  console.log(conversation.id);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        userId={otherMember.user.id}
        name={otherMember.user.name}
        serverId={params.serverId}
        type="conversation"
        imageUrl={otherMember.user.photo}
      />
      <ChatMessage
        name={currentMember.user.name}
        member={currentMember}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/direct-message"
        socketUrl="/direct-message/handler"
        socketQuery={{
          conversationId: conversation.id,
        }}
        paramKey="conversationId"
        paramValue={conversation.id}
      />
      <ChatInput
        name={otherMember.user.name}
        type="conversation"
        apiUrl="/direct-message/handler"
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default MemberIdPage;
