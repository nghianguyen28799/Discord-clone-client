"use client";

import React from "react";
import SignInModal from "../../../components/modals/singin-modal";
import { useUserStore } from "@/app/hooks/use-user-store";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const { token } = useUserStore();
  const router = useRouter();

  if (token.accessToken) {
    router.push("/");
  }

  return <SignInModal />;
};

export default SignInPage;
