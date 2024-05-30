import { useSocketContext } from "@/components/providers/socket-provider";
import { axiosAuth } from "@/lib/axiosAuth";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { socket } = useSocketContext();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      {
        skipNull: true,
      }
    );

    const res = await axiosAuth(url);
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchInterval: socket ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
