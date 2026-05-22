import { mock } from "node:test";
import { Text } from "ink";

mock.module("ink-link", {
  defaultExport: ({
    children,
    fallback,
    url,
  }: {
    children: React.ReactNode;
    url: string;
    fallback?: (_text: React.ReactNode, url: string) => string;
  }) => <Text>{fallback ? fallback(children, url) : children}</Text>,
});
