"use client";
import React, { useCallback, useEffect } from "react";
import Spinner from "../../../../components/spinner";
import Link from "next/link";
import { useUserStore } from "@/app/hooks/use-user-store";
import { useRouter } from "next/navigation";
import { verifyEmailApiHandler } from "@/api/auth/auth";
import toast from "react-hot-toast";

interface IProps {
  params: { verifyId: string };
}
const VerifyIdPage = ({ params }: IProps) => {
  const { verifyId } = params;

  const { token } = useUserStore();
  const router = useRouter();

  if (token.accessToken) {
    router.push("/");
  }

  const fetchApiVerify = useCallback(async () => {
    const res = await verifyEmailApiHandler(verifyId);
    if (res?.status === "success") {
      toast.success(res?.message || "");
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, [verifyId]);

  useEffect(() => {
    fetchApiVerify();
  }, [fetchApiVerify]);

  // return (
  //   <div className="flex flex-col gap-2 justify-center items-center">
  //     <p>Email authentication failed</p>
  //     <Link href="/sign-up" className="font-semibold text-blue-500 underline">
  //       Sign Up
  //     </Link>
  //   </div>
  // );
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <Spinner />
      <p className="text-sm">Verifying email</p>
    </div>
  );
};

export default VerifyIdPage;
