import { useSocketContext } from "@/components/providers/socket-provider";
import { MemberType } from "@/lib/type/memberType";
import { ProfileType } from "@/lib/type/profileType";
import { scrollToBottomWhenHasMessage } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export type MessageWithMemberWithProfile = MessageType & {
  member: MemberType & {
    profile: ProfileType;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.page === 0) {
          return oldData;
        }
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        scrollToBottomWhenHasMessage();
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueriesData([queryKey] as any, (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };
        scrollToBottomWhenHasMessage();

        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [addKey, queryClient, queryKey, socket, updateKey]);
};
