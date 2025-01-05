import { TextArea } from "@radix-ui/themes";
import { BaseProductConfiguration } from "./page";

export type TextAreaConfiguration = BaseProductConfiguration & {
  type: "textarea";
};

const TextAreaRenderer = () => {
  return <TextArea />;
};

export default TextAreaRenderer;
