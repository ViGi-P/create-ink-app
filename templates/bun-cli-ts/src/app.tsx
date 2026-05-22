import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "@endernoke/wax";
import { Box, Text } from "ink";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesDirectory = path.join(__dirname, "routes");

export type AppProperties = {
  readonly name?: string;
};

export default function App({ name = "Ink" }: AppProperties) {
  return (
    <Box flexDirection="column" padding={1}>
      <Text>Hello world, {name}!</Text>
      <Router basePath={routesDirectory} initialRoute="/" />
    </Box>
  );
}
