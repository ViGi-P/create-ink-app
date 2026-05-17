import { Box, Text, useInput } from "ink";
import { useRouter } from "@endernoke/wax";
import EscapeKey from "../components/escape-key.jsx";

export default function Home() {
  const router = useRouter();

  useInput((input) => {
    switch (input) {
      case "1": {
        router.push("/users/123");
        break;
      }

      case "2": {
        router.push("/shop");
        break;
      }

      // No default
    }
  });

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color="green">[1] - View User Profile (Dynamic Route)</Text>
      <Text color="blueBright">[2] - Browse Shop (Optional Catch-all)</Text>
      <EscapeKey />
    </Box>
  );
}
