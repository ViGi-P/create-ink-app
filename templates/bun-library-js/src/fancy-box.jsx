import { Box, Text } from "ink";

/**
 * Component that renders a fancy box.
 * @param {JSX.Element} children - The content to render inside the box.
 * @returns {JSX.Element} The rendered component.
 */
export default function FancyBox({ children } = {}) {
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
