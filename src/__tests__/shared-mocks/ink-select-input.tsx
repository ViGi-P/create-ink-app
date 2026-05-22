import { Box, Text } from "ink";
import { mock } from "node:test";

mock.module("ink-select-input", {
  defaultExport: ({
    items,
  }: {
    items: { value: unknown; label: string }[];
    initialIndex?: number;
    onSelect: (item: { value: unknown; label: string }) => void;
  }) => (
    <Box flexDirection="column">
      {items.map((item, i) => (
        <Text key={i}>{item.label}</Text>
      ))}
    </Box>
  ),
});

// mock.module("ink-select-input", {
//   defaultExport: ({
//     items,
//   }: {
//     items: { value: unknown; label: string }[];
//     initialIndex?: number;
//     onSelect: (item: { value: unknown; label: string }) => void;
//   }) => (
//     <Box flexDirection="column">
//       {items.map((item, i) => (
//         <Text key={i}>{item.label}</Text>
//       ))}
//     </Box>
//   ),
// });
