import { Text } from "ink";
import { mock } from "node:test";

mock.module("ink-text-input", {
  defaultExport: ({
    value,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => <Text>{value}</Text>,
});

// mock.module("ink-text-input", {
//   defaultExport: ({
//     value,
//   }: {
//     value: string;
//     onChange: (v: string) => void;
//   }) => <Text>{value}</Text>,
// });
