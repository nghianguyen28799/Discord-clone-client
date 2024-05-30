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
import { useUserStore } from "../../app/hooks/use-user-store";
import toast from "react-hot-toast";
import { loginApiHandler } from "../../api/auth/auth";

const schema = yup.object({
  email: yup.string().min(1, {
    message: "Email is required",
  }),
  password: yup.string().min(1, {
    message: "Password is required",
  }),
});

const SignInModal = () => {
  const router = useRouter();
  const { token, setToken } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);

  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const { formState, handleSubmit, control } = methods;

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      const { email = "", password = "" } = data;
      const res = await loginApiHandler({
        email,
        password,
      });

      if (res && res.data) {
        const accessToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        setToken({
          accessToken,
          refreshToken,
        });
        router.refresh();
      } else if (res && res.message) {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token.accessToken) {
      return router.push("/");
    }
    setIsMounted(true);
  }, [router, token.accessToken]);

  if (!isMounted) return null;

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Welcome back!
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Nice to meet you again!
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            autoComplete="off"
          >
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
              <div>
                <span className="text-zinc-500 text-sm ">
                  Do you need an account?
                </span>{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-600 font-medium text-sm"
                >
                  Sign up
                </Link>
              </div>
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Login
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
