"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const MonacoInput = ({
  name,
  defaultValue,
  value,
  schema,
  onChangeValue,
}: {
  name: string;
  defaultValue: string;
  value?: string;
  schema?: unknown;
  onChangeValue?: (value: string) => void;
}) => {
  const { resolvedTheme } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    inputRef.current.value = value ?? defaultValue;
  }, [defaultValue, value]);

  const onChange = (content?: string) => {
    const nextValue = content || "";

    if (inputRef.current) {
      inputRef.current.value = nextValue;
    }

    onChangeValue?.(nextValue);
  };

  return (
    <>
      <input
        type="hidden"
        name={name}
        ref={inputRef}
        defaultValue={value ?? defaultValue}
        className="hidden"
      />
      <Monaco
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        beforeMount={(monaco) => {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions(
            schema
              ? {
                  validate: true,
                  schemas: [
                    {
                      uri: "https://dummy.com/schema.json",
                      fileMatch: ["definition.json"],
                      schema,
                    },
                  ],
                }
              : { validate: true }
          );
        }}
        height="50vh"
        defaultLanguage="json"
        path="definition.json"
        theme={resolvedTheme === "dark" ? "vs-dark" : "vs-light"}
      />
    </>
  );
};

export default MonacoInput;
