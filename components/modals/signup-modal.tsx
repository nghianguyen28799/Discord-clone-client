"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/app/hooks/use-user-store";
import { registerApiHandler } from "@/api/auth/auth";
import { IRegisterRequest } from "@/api/auth/type";
import toast from "react-hot-toast";
import Spinner from "../spinner";

const schema = yup.object({
  email: yup.string().required("Email is required"),
  name: yup.string().required("Email is required").max(30, {
    message: "Name only maximum 30 characters",
  }),
  password: yup.string().required("Email is required"),
  passwordConfirm: yup.string().required("Email is required"),
});

const SignUpModal = () => {
  const { token, setToken } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (token.accessToken) {
      return router.push("/");
    }
    setIsMounted(true);
  }, [router, token.accessToken]);

  const methods = useForm<IRegisterRequest>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    formState,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    const res = await registerApiHandler(data);
    if (res?.status === "success") {
      toast.success(res?.message || "");
      router.push("/sign-in");
    }
    router.refresh();
  };

  if (!isMounted) return null;

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create an account
          </DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 px-6">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Your name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="password"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Password Confirm
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="password"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter password confirm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Link
                  href="/sign-in"
                  className="text-blue-600 font-medium text-sm"
                >
                  Already have an account?
                </Link>
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Sign Up
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
