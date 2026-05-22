import { Box, Text } from "ink";

export default function HelloWorldBanner({ name = "Ink" }: { name?: string }) {
  return (
    <Box flexDirection="column" padding={1}>
      <Text>Hello world, {name}!</Text>
    </Box>
  );
}
