import { Box, Text } from "ink";
import { type ReactNode } from "react";

export default function FancyBox({ children }: { children?: ReactNode }) {
  if (!children) return null;

  return (
    <Box
      flexDirection="column"
      padding={1}
      borderColor="magentaBright"
      borderStyle="round"
    >
      <Text>{children}</Text>
    </Box>
  );
}
