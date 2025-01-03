import { Grid, Flex, Heading, Text } from "@radix-ui/themes";

import {
  PrinterIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "High-Quality Print",
    description:
      "We use one of the best technology. Vibrant colors, razor-sharp details and lasting quality.",
    icon: PrinterIcon,
  },
  {
    name: "Ready for Anything",
    description:
      "We are more than happy to help you with any project. No matter how complex or custom.",
    icon: PuzzlePieceIcon,
  },
  {
    name: "Delivery Options",
    description:
      "Pick your order up personally, at your favorite pick-up point, or have it delivered to your door.",
    icon: TruckIcon,
  },
  {
    name: "Guranteed",
    description:
      "With 10+ years of experience and plenty of satisfied customers, we guarantee you the best quality and service.",
    icon: TrophyIcon,
  },
];

export default function Features() {
  return (
    <Flex direction="column" align="center" className="my-32">
      <Heading size="9" className="font-semibold mb-20">
        Touch your memories.
      </Heading>

      <Grid columns={{ initial: "1", sm: "2", md: "4" }} className="gap-20">
        {features.map((feature) => (
          <Flex key={feature.name} direction="column" align="center" gap="2">
            <Flex
              direction="column"
              align="center"
              justify="center"
              className="p-5 rounded-full bg-blue-9 mb-2"
            >
              <feature.icon className="size-7 text-white" />
            </Flex>

            <Text size="5" weight="medium" align="center">
              {feature.name}
            </Text>
            <Text size="3" color="gray" align="center">
              {feature.description}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
}
