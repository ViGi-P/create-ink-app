import { Box, Text } from "ink";

/**
 * Component that renders a banner with a greeting message.
 * @param {Object} props - The component props.
 * @param {string} props.name - The name to display in the greeting.
 * @returns {JSX.Element} The rendered component.
 */
export default function HelloWorldBanner({ name = "Ink" } = {}) {
  return (
    <Box flexDirection="column" padding={1}>
      <Text>Hello world, {name}!</Text>
    </Box>
  );
}
