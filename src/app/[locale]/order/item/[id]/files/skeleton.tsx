import { Grid, Skeleton } from "@radix-ui/themes";

const FilesSkeleton = () => {
  return (
    <Grid
      columns={{
        initial: "2",
        xs: "3",
        sm: "4",
        md: "5",
        lg: "6",
        xl: "7",
      }}
      gap="3"
      width="full"
    >
      <Skeleton className="rounded-3 h-[8rem] cursor-wait" />
    </Grid>
  );
};

export default FilesSkeleton;
