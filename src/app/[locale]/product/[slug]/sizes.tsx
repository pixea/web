"use client";

import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";

const sizes = [
  "9 x 13",
  "10 x 15",
  "13 x 18",
  "15 x 21",
  "18 x 24",
  "20 x 30",
  "24 x 30",
  "30 x 40",
  "40 x 50",
  "50 x 70",
  "70 x 100",
  "100 x 150",
];

const Sizes = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <Flex direction="column" gap="3">
      <Text weight="medium" size="3" className="flex items-center gap-1.5">
        <ArrowsPointingOutIcon className="size-5" /> Obľúbené rozmery
      </Text>

      <Flex
        direction="row"
        align="center"
        gap="2"
        wrap="wrap"
        className="text-gray-11"
      >
        {sizes.slice(0, 4).map((size) => (
          <Button key={size} variant="surface" size="2" color="blue">
            {size} cm
          </Button>
        ))}
        {showAll === true
          ? sizes.slice(5).map((size) => (
              <Button key={size} variant="surface" size="2" color="blue">
                {size} cm
              </Button>
            ))
          : undefined}
        |
        <Button variant="outline" size="2" color="blue">
          Na mieru
        </Button>
      </Flex>

      <Button
        variant="ghost"
        size="2"
        color="gray"
        onClick={() => setShowAll(!showAll)}
        className="w-fit"
      >
        Zobraziť {showAll === true ? "menej" : "viac"}
      </Button>
    </Flex>
  );
};

export default Sizes;
