export enum ChannelTypeEnum {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export interface ChannelType {
  id: string;
  name: string;
  type: ChannelTypeEnum;
  userId: string;

  serverId: string;

  createdAt: Date;
  updatedAt: Date;
}
