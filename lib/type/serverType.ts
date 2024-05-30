import { ChannelType } from "./channelType";
import { MemberType } from "./memberType";

export interface ServerType {
  id: string;
  name: string;
  image: string;
  inviteCode: string;

  userId: string;

  createdAt: Date;
  updatedAt: Date;
  members: MemberType[];
  channels: ChannelType[];
}
