"use client";

import Toast, { ToastProvider } from "@/components/toast/toast";
import { ActionState } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const ActionToasts = ({ state }: { state: ActionState }) => {
  const t = useTranslations("Common");
  const [toasts, setToasts] = useState<ActionState & { id: string }[]>([]);

  useEffect(() => {
    if (!state.result) return;

    setToasts((prev) => [...prev, { id: Math.random().toString(), ...state }]);
  }, [state]);

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} type={state.result} title={t(state.message)}>
          {t(`message.${state.message}`)}
        </Toast>
      ))}
    </ToastProvider>
  );
};
