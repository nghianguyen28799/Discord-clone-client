"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
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
import { useModalStore } from "@/app/hooks/use-modal-store";
import qs from "query-string";
import UploadFile from "../upload-file";
import { X } from "lucide-react";
import Image from "next/image";
import { convertFileToBase64 } from "@/lib/utils";
import { ResponseApi } from "@/lib/type/axiosType";
import { axiosFormData } from "@/lib/axiosAuth";
import toast from "react-hot-toast";

const schema = yup.object({
  imageUrl: yup.array().min(1, "Server image is required"),
});

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();
  const [isMounted, setIsMounted] = useState(false);
  const [base64, setBase64] = useState("");
  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";

  const { apiUrl, query } = data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const methods = useForm({
    defaultValues: {
      imageUrl: [],
    },
    resolver: yupResolver(schema),
  });

  const { reset, formState, handleSubmit, control } = methods;

  const isLoading = formState.isSubmitting;

  const handleClose = () => {
    reset();
    onClose();
  };

  const imageUrl = useWatch({
    control,
    name: "imageUrl",
  });

  const base64Image = useCallback(async () => {
    if (imageUrl && imageUrl.length > 0) {
      const file: any = imageUrl?.[0];
      const base64 = await convertFileToBase64(file);
      setBase64(`data:${file.type};base64, ${base64}`);
    } else {
      setBase64("");
    }
  }, [imageUrl]);

  useEffect(() => {
    base64Image();
  }, [base64Image]);

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      if (data) {
        const form = new FormData();
        form.append("image", data.imageUrl?.[0]);

        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query,
        });

        const res: ResponseApi<any> = await axiosFormData.post(url, form);
        if (res?.data) {
          reset();
          router.refresh();
          onClose();
        } else {
          toast.error(res?.message || "");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={control}
                  name="imageUrl"
                  render={({ field: { value = [], onChange } }) => (
                    <FormItem>
                      <FormControl>
                        {!base64 ? (
                          <UploadFile onChange={onChange} value={value} />
                        ) : (
                          <div className="w-full flex  items-center justify-center">
                            <div className="relative">
                              <Image
                                src={base64}
                                alt="image"
                                width={200}
                                height={200}
                                className="rounded-full"
                              />
                              <Button
                                size="icon"
                                className="rounded-full w-6 h-6 bg-red-500 hover:bg-red-600 absolute top-0 right-0"
                                onClick={() => {
                                  onChange([]);
                                }}
                              >
                                <X size={14} color="#fff" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
