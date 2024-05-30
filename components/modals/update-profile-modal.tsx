"use client";
import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
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
import { useUserStore } from "../../app/hooks/use-user-store";
import { useModalStore } from "@/app/hooks/use-modal-store";
import { RenderAvatar } from "../render-avatar";
import { Pencil } from "lucide-react";
import { axiosAuth, axiosFormData } from "@/lib/axiosAuth";
import { ProfileType } from "@/lib/type/profileType";
import { ResponseApi } from "@/lib/type/axiosType";
import toast from "react-hot-toast";
import { allowUploadFile } from "@/lib/utils";

const schema = yup.object({
  email: yup.string(),
  name: yup.string().required("Email is required"),
  password: yup.string(),
});

const UpdateProfileModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type } = useModalStore();
  const { profile, setProfile } = useUserStore();
  const isModalOpen = isOpen && type === "updateProfile";

  const methods = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const { formState, handleSubmit, control, reset } = methods;
  const uploadRef = useRef<any>(null);

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      const res: ResponseApi<ProfileType> = await axiosAuth.patch(
        "/user/update",
        data
      );
      if (res?.data) {
        setProfile(res?.data);
        router.refresh();
        handleClose();
      } else {
        toast.error(res?.message || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const onFileChange = async (event: any) => {
    try {
      const image = event?.target?.files?.[0];

      if (image) {
        if (!allowUploadFile(image.type)) {
          return;
        }
        const form = new FormData();

        form.append("image", image);
        const res: ResponseApi<ProfileType> = await axiosFormData.patch(
          "/user/change-avatar",
          form
        );
        if (res?.data) {
          setProfile(res?.data);
          router.refresh();
          handleClose();
        } else {
          toast.error(res?.message || "");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (profile) {
      1;
      reset({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile, reset]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="flex items-center justify-center">
            <div className="relative w-auto">
              <RenderAvatar
                photo={profile?.photo}
                name={profile?.name}
                size={20}
              />
              <div className="absolute w-max top-[-15px] right-[-15px]">
                <input
                  type="file"
                  hidden
                  ref={uploadRef}
                  onChange={onFileChange}
                />
                <Button size="icon" onClick={() => uploadRef.current.click()}>
                  <Pencil className="w-4 " />
                </Button>
              </div>
            </div>
          </DialogTitle>
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
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="name"
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
                name="password"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
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
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;
