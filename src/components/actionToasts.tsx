"use client";

import Toast, { ToastProvider } from "@/components/toast/toast";
import { ActionState } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useReducer } from "react";

export const ActionToasts = ({ state }: { state: ActionState }) => {
  const t = useTranslations("Common");

  type ToastItem = ActionState & { id: string };
  type ToastAction =
    | { type: "push"; payload: ActionState }
    | { type: "remove"; payload: { id: string } };

  const [toasts, dispatch] = useReducer(
    (current: ToastItem[], action: ToastAction): ToastItem[] => {
      if (action.type === "push") {
        const payload = action.payload;
        if (!payload.result) return current;

        return [
          ...current,
          {
            id: crypto.randomUUID(),
            ...payload,
          },
        ];
      }

      return current.filter((toast) => toast.id !== action.payload.id);
    },
    []
  );

  useEffect(() => {
    if (!state.result) return;
    dispatch({ type: "push", payload: state });
  }, [state]);

  if (!toasts.length) return null;

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.result}
          title={t(toast.message)}
          onOpenChange={(open) => {
            if (open) return;
            dispatch({ type: "remove", payload: { id: toast.id } });
          }}
        >
          {t(`message.${toast.message}`)}
        </Toast>
      ))}
    </ToastProvider>
  );
};
