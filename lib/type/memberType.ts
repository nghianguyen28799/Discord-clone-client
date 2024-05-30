import { UserType } from "./useType";

export enum MemberRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}

export interface MemberType {
  id: string;
  role: MemberRole;

  userId: string;

  serverId: string;

  user: UserType;
  createdAt: Date;
  updatedAt: Date;
}
