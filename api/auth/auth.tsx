import axiosClient from "@/lib/axios";
import {
  ILoginRequest,
  ILoginResponse,
  IProfileResponse,
  IRegisterRequest,
} from "./type";
import { BaseApi } from "../type";

export const loginApiHandler = async (
  req: ILoginRequest
): Promise<BaseApi<ILoginResponse> | undefined> => {
  try {
    const res: BaseApi<ILoginResponse> = await axiosClient.post(
      "/auth/login",
      req
    );

    return res;
  } catch {}
};

export const registerApiHandler = async (
  req: IRegisterRequest
): Promise<BaseApi<string> | undefined> => {
  try {
    const res: BaseApi<string> = await axiosClient.post("/auth/register", req);

    return res;
  } catch {}
};

export const verifyEmailApiHandler = async (
  verifyId: string
): Promise<BaseApi<any> | undefined> => {
  try {
    const res: BaseApi<any> = await axiosClient.get(
      `/auth/verifyEmail/${verifyId}`
    );

    return res;
  } catch {}
};
