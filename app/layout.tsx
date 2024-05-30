import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "../components/providers/theme-provider";
import ModalProvider from "../components/providers/modal-provider";
import QueryProvider from "../components/providers/query-provider";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { SocketContextProvider } from "@/components/providers/socket-provider";

const inter = Inter({ subsets: ["latin"] });

interface IProps {
  children: ReactNode;
}

export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-white dark:bg-[#313338]")}>
        <ThemeProvider
          attribute="class"
          enableSystem
          storageKey="discord-theme"
        >
          <SocketContextProvider>
            <ModalProvider />
            <QueryProvider>{children}</QueryProvider>
          </SocketContextProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
