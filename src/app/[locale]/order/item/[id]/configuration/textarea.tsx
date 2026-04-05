import { TextArea } from "@radix-ui/themes";
import { debounce } from "radash";
import { TextareaConfiguration } from "@/db/validation";
import { useMemo } from "react";

interface Props {
  config: TextareaConfiguration;
  value?: string | null;
  onChange: (value: string | null) => void;
}

const TextAreaRenderer = ({ config, value, onChange }: Props) => {
  const debouncedOnChange = useMemo(
    () => debounce({ delay: 1000 }, (newValue: string) => onChange(newValue)),
    [onChange]
  );

  const defaultValue = value || config.default || undefined;

  return (
    <TextArea
      defaultValue={defaultValue}
      onChange={(event) => debouncedOnChange(event.target.value)}
      onBlur={(event) => {
        debouncedOnChange.flush(event.target.value);
        debouncedOnChange.cancel();
      }}
    />
  );
};

export default TextAreaRenderer;
