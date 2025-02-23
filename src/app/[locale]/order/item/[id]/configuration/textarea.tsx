import { TextArea } from "@radix-ui/themes";
import { TextareaConfiguration } from "@/db/validation";

interface Props {
  config: TextareaConfiguration;
  onChange: (value: string | null) => void;
}

const TextAreaRenderer = ({}: Props) => {
  return <TextArea />;
};

export default TextAreaRenderer;
