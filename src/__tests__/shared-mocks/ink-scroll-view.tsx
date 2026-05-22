import { mock } from "node:test";

mock.module("ink-scroll-view", {
  namedExports: {
    ScrollView: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  },
});
