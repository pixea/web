"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRef } from "react";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const MonacoInput = ({
  name,
  defaultValue,
  schema,
}: {
  name: string;
  defaultValue: string;
  schema?: unknown;
}) => {
  const { resolvedTheme } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const onChange = (content?: string) => {
    if (inputRef.current) {
      inputRef.current.value = content || "";
    }
  };

  return (
    <>
      <input type="hidden" name={name} ref={inputRef} className="hidden" />
      <Monaco
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
