"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm, useWatch } from "react-hook-form";
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
import UploadFile from "../upload-file";
import { convertFileToBase64 } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import { ResponseApi } from "@/lib/type/axiosType";
import { X } from "lucide-react";
import { useModalStore } from "@/app/hooks/use-modal-store";
import { axiosAuth, axiosFormData } from "@/lib/axiosAuth";

const schema = yup.object({
  name: yup.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: yup.array().min(1, "Server image is required"),
});

export const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const router = useRouter();

  const isModalOpen = isOpen && type === "createServer";

  const [isMounted, setIsMounted] = useState(false);
  const [base64, setBase64] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const methods = useForm({
    defaultValues: {
      name: "",
      imageUrl: [],
    },
    resolver: yupResolver(schema),
  });

  const { formState, handleSubmit, control, reset } = methods;

  const isLoading = formState.isSubmitting;
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
        form.append("name", data.name || "");

        const res: ResponseApi<any> = await axiosFormData.post(
          "/server/create",
          form
        );
        if (res?.data) {
          router.push(`/servers/${res.data.id}`);
          window.location.reload();
        } else {
          toast.error(res?.message || "");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add a your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
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
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
