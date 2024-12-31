import * as React from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { IconButton } from "@radix-ui/themes";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ToastProps {
  title: string;
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RadixToast.Provider swipeDirection="right">
      {children}
      <RadixToast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </RadixToast.Provider>
  );
};

export const Toast = ({ title, children }: ToastProps) => {
  return (
    <RadixToast.Root className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-gray-6 p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]">
      <RadixToast.Title className="mb-[5px] text-[15px] font-medium text-gray-12 [grid-area:_title]">
        {title}
      </RadixToast.Title>
      <RadixToast.Description asChild>{children}</RadixToast.Description>
      <RadixToast.Close className="[grid-area:_action]" asChild>
        <IconButton>
          <XMarkIcon className="size-4" />
        </IconButton>
      </RadixToast.Close>
    </RadixToast.Root>
  );
};

export default Toast;
