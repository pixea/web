import { Flex, Text, Grid, Skeleton } from "@radix-ui/themes";

const FilesSkeleton = () => {
  return (
    <Flex direction="column" gap="4">
      <Text
        className="flex items-center justify-center border border-dashed border-gray-8 p-6 rounded-3 text-gray-11 cursor-pointer hover:bg-gray-3"
        as="label"
      >
        <Flex
          direction="column"
          align="center"
          gap="5"
          className="max-w-sm text-center"
          my="2"
        >
          <Flex direction="column" align="center" gap="3">
            <Skeleton className="rounded-3 w-9 h-9 cursor-wait" />

            <Skeleton className="rounded-3 w-64 h-10 xs:w-72 xs:h-6 cursor-wait" />
          </Flex>

          <Flex direction="column" align="center" gap="1">
            <Text color="gray" size="1" className="flex items-center gap-1.5">
              <Skeleton className="rounded-3 w-40 h-4 cursor-wait" />
            </Text>
            <Text color="gray" size="1">
              <Skeleton className="rounded-3 w-64 h-8 xs:w-80 xs:h-4 cursor-wait" />
            </Text>
          </Flex>
        </Flex>
      </Text>

      <Grid
        columns={{
          initial: "2",
          xs: "3",
          sm: "5",
          md: "3",
          lg: "4",
        }}
        gap="4"
        width="full"
      ></Grid>
    </Flex>
  );
};

export default FilesSkeleton;
