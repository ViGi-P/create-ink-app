import { Box, Text, useInput } from "ink";
import { useRouter, useParams } from "@endernoke/wax";
import EscapeKey from "../../components/escape-key.tsx";

export default function Shop() {
  const router = useRouter();
  const parameters = useParams<{ category?: string[] }>();
  const category = parameters.category ?? [];
  const isRoot = category.length === 0;

  useInput((input) => {
    if (input === "p" && isRoot) {
      router.push("/shop/electronics/phones");
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        🛍️ Shop (Optional Catch-all Route)
      </Text>
      <Text> </Text>
      {isRoot ? (
        <Text>
          Browsing: <Text color="yellow">All Categories</Text>
        </Text>
      ) : (
        <Text>
          Category: <Text color="yellow">{category.join(" / ")}</Text>
        </Text>
      )}
      <Text>
        Route Pattern: /shop{"{"}/{"\u002A"}category{"}"}
      </Text>
      <Text> </Text>
      <Text dimColor>
        This demonstrates an optional catch-all route [[...category]]
      </Text>
      <Text dimColor>
        It matches /shop (root) AND /shop/category/subcategory
      </Text>
      <Box marginTop={1} flexDirection="column">
        {isRoot ? (
          <Text color="blueBright">[P] - Go to the phones section</Text>
        ) : null}
        <EscapeKey />
      </Box>
    </Box>
  );
}
