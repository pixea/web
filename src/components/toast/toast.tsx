import * as React from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { IconButton } from "@radix-ui/themes";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface ToastProps {
  type?: "error" | "success" | "warning" | "info";
  title: string;
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixToast.Provider swipeDirection="right">
      {children}
      <RadixToast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[400px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </RadixToast.Provider>
  );
};

export const Toast = ({ type, title, children }: ToastProps) => {
  const containerClasses = cn(
    "grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md p-[15px] ring-1 ring-transparent shadow-lg [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out] bg-gray-2",
    {
      "bg-red-2 ring-red-6 shadow-red-3": type === "error",
      "bg-green-2 ring-green-6 shadow-green-3": type === "success",
      "bg-yellow-2 ring-yellow-6 shadow-yellow-3": type === "warning",
      "bg-blue-2 ring-blue-6 shadow-blue-3": type === "info",
    }
  );

  const titleClasses = cn(
    "flex items-center gap-1.5 mb-[5px] text-[16px] font-medium text-gray-12 [grid-area:_title]",
    {
      "text-red-12": type === "error",
      "text-green-12": type === "success",
      "text-yellow-12": type === "warning",
      "text-blue-12": type === "info",
    }
  );

  const icon =
    type === "error"
      ? XCircleIcon
      : type === "success"
        ? CheckCircleIcon
        : type === "warning"
          ? ExclamationTriangleIcon
          : type === "info"
            ? InformationCircleIcon
            : undefined;

  return (
    <RadixToast.Root className={containerClasses}>
      <RadixToast.Title className={titleClasses}>
        {icon && React.createElement(icon, { className: "size-5" })} {title}
      </RadixToast.Title>
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
