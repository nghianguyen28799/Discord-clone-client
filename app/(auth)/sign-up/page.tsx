"use client";

import React from "react";
import SignUpModal from "../../../components/modals/signup-modal";
import { useUserStore } from "@/app/hooks/use-user-store";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const { token } = useUserStore();
  const router = useRouter();

  if (token.accessToken) {
    router.push("/");
  }

  return <SignUpModal />;
};

export default SignUpPage;
