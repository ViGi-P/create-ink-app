import { Box, Text } from "ink";
import { useParams } from "@endernoke/wax";
import EscapeKey from "../../components/escape-key.tsx";

export default function UserProfile() {
  const parameters = useParams<{ id: string }>();

  return (
    <Box flexDirection="column" rowGap={1}>
      <Box flexDirection="column">
        <Text bold color="cyan">
          👤 User Profile (Dynamic Route)
        </Text>
        <Text>
          User ID: <Text color="yellow">{parameters.id}</Text>
        </Text>
      </Box>
      <Box flexDirection="column">
        <Text>Route Pattern: /users/:id</Text>
        <Text dimColor>This demonstrates a dynamic route segment [id]</Text>
      </Box>
      <EscapeKey />
    </Box>
  );
}
