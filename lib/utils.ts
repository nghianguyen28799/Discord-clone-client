import { type ClassValue, clsx } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      let encoded: string = reader.result?.toString() || "";
      encoded = encoded.replace(/^data:(.*,)?/, "");

      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }

      resolve(encoded);
    };

    reader.onerror = (error) => reject(error);
  });
}

export const allowUploadFile = (fileType: string) => {
  const files = ["image/png", "image/jpg"];
  if(!files.includes(fileType)) {
    toast.error("You only upload images.")
    return false
  }
  return true;
}

export const scrollToBottomWhenHasMessage = () => {
  const chatMessageElement: any = document.querySelector("#chat-message");
  const chatScrollBottomElement: any = document.querySelector("#bottom-div-scroll");

  if(!chatMessageElement || !chatScrollBottomElement) return;

  const scrollToBottomHeight = chatMessageElement.scrollHeight - chatMessageElement.clientHeight - chatMessageElement.scrollTop;

  if(scrollToBottomHeight <= 100) {
    setTimeout(() => {
      chatScrollBottomElement?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }
}