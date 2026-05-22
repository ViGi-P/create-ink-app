import { mock } from "node:test";

mock.module("ink-gradient", {
  defaultExport: ({
    children,
  }: {
    children: React.ReactNode;
    name?: string;
  }) => <>{children}</>,
});
