import { Text, useApp, useInput } from "ink";
import { useRouter } from "@endernoke/wax";

export default function EscapeKey() {
  const router = useRouter();
  const exit = useApp().exit;

  useInput((input, key) => {
    if (key.escape) {
      if (router.canGoBack) router.back();
      else exit(0);
    }
  });

  if (router.canGoBack) return <Text color="redBright">[ESC] - Go back</Text>;

  return <Text color="redBright">[ESC] - Quit</Text>;
}
