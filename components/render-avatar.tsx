import { FC, Fragment, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSocketContext } from "./providers/socket-provider";

interface RenderAvatarProps {
  userId?: string;
  photo?: string;
  name?: string;
  size?: number;
}
export const RenderAvatar: FC<RenderAvatarProps> = (props) => {
  const { photo, name, size, userId } = props;
  const _size = size || 12;

  const { onlineUsers } = useSocketContext();

  const isOnline = useMemo(() => {
    if (!userId) return false;
    return onlineUsers.includes(userId);
  }, [userId, onlineUsers]);

  const renderStatus = useCallback(() => {
    if (!userId) return null;
    if (isOnline)
      return (
        <span className="bottom-0 left-8 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full z-50"></span>
      );
    return (
      <span className="bottom-0 left-8 absolute  w-3.5 h-3.5 bg-red-400 border-2 border-white dark:border-gray-800 rounded-full z-50"></span>
    );
  }, [userId, isOnline]);

  return (
    <Button
      variant="primary"
      size="icon"
      className={`rounded-full w-${_size} h-${_size}`}
    >
      <div className="relative w-full h-full">
        <Avatar className=" w-full h-full border-stone-500 border-2">
          {photo ? (
            <Fragment>
              <AvatarImage src={photo} alt="avatar-user" />
              <AvatarFallback className="size">
                {name?.charAt(0)}
              </AvatarFallback>
            </Fragment>
          ) : (
            <Fragment>
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Fragment>
          )}
        </Avatar>
        {renderStatus()}
      </div>
    </Button>
  );
};
