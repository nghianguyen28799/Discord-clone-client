"use client";

import { useModalStore } from "@/app/hooks/use-modal-store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Plus } from "lucide-react";
import qs from "query-string";
import axios from "axios";
import { Form, FormControl, FormField, FormItem } from "../form";
import { Input } from "../input";
import EmojiPicker from "@/components/emoji-picker";
import { axiosAuth } from "@/lib/axiosAuth";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = yup.object({
  content: yup.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModalStore();
  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting: isLoading },
  } = methods;

  const handleScrollToBottom = () => {
    const bottomDiv = document.querySelector("#bottom-div-scroll");

    if (bottomDiv) {
      setTimeout(() => {
        bottomDiv?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const onSubmit = async (values: yup.InferType<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axiosAuth.post(url, values);

      reset();
      router.refresh();
      handleScrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="content"
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    value={value}
                    disabled={isLoading}
                    placeholder={
                      `Message ${type === "conversation"}` ? name : "#" + name
                    }
                    onChange={(value) => onChange(value)}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: any) => onChange(`${value} ${emoji}`)}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
