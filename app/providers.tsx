"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { UserProvider } from "@/contexts/userContext";
import { MessageProvider } from "@/contexts/messageContext";


export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
        <MessageProvider>
          <UserProvider>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </UserProvider>
        </MessageProvider>
    </NextUIProvider>
  );
}
