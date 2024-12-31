import * as React from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { IconButton, Theme } from "@radix-ui/themes";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import themeConfig from "@/app/_themes/config";

interface ToastProps {
  type?: "error" | "success" | "warning" | "info";
  title: string;
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixToast.Provider swipeDirection="right">
      <Theme {...themeConfig}>
        {children}
        <RadixToast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Theme>
    </RadixToast.Provider>
  );
};

export const Toast = ({ type, title, children }: ToastProps) => {
  const containerClasses = cn(
    "grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out] bg-gray-2",
    {
      "bg-red-2": type === "error",
      "bg-green-2": type === "success",
      "bg-yellow-2": type === "warning",
      "bg-blue-2": type === "info",
    }
  );

  const titleClasses = cn(
    "mb-[5px] text-[15px] font-medium text-gray-12 [grid-area:_title]",
    {
      "text-red-11": type === "error",
      "text-green-11": type === "success",
      "text-yellow-11": type === "warning",
      "text-blue-11": type === "info",
    }
  );

  return (
    <RadixToast.Root className={containerClasses}>
      <RadixToast.Title className={titleClasses}>{title}</RadixToast.Title>
      <RadixToast.Description>{children}</RadixToast.Description>
      <RadixToast.Close className="[grid-area:_action]" asChild>
        <IconButton variant="ghost" color="gray" size="3">
          <XMarkIcon className="size-4" />
        </IconButton>
      </RadixToast.Close>
    </RadixToast.Root>
  );
};

export default Toast;
