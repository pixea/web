import { cn } from "@/lib/utils";
import { Flex, FlexProps } from "@radix-ui/themes";

const BottomBar = ({ children, className, ...props }: FlexProps) => {
  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      position="sticky"
      bottom="2"
      p="4"
      my="4"
      className={cn("bg-blue-2 rounded-3 border border-blue-5", className)}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default BottomBar;
