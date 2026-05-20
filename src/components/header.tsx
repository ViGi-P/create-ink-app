import Gradient from "ink-gradient";
import { Box, Text } from "ink";
import packageJson from "../../package.json" with { type: "json" };
import Link from "ink-link";

export default function Header({ text }: { text: string }) {
  return (
    <Box
      borderStyle="single"
      borderTop={false}
      borderLeft={false}
      borderRight={false}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text bold>
        <Gradient name="pastel">{text}</Gradient>
        <Text dimColor>(v{packageJson.version})</Text>
      </Text>
      <Box width="100%" justifyContent="center" alignItems="center">
        <Text underline>
          <Link
            url="https://github.com/vigi-p/create-ink-app"
            fallback={(_text, url) => url}
          >
            GitHub
          </Link>
        </Text>
        <Text>{" | "}</Text>
        <Text underline>
          <Link
            url="https://www.npmjs.com/package/@vigi-p/create-ink-app"
            fallback={(_text, url) => url}
          >
            NPM
          </Link>
        </Text>
      </Box>
    </Box>
  );
}
