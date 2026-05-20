import { Box, Text } from "ink";

export default function Footer({
  isFirst,
  isLast,
}: {
  isFirst: boolean;
  isLast?: boolean;
}) {
  return (
    <Box
      justifyContent="space-between"
      paddingLeft={1}
      paddingRight={1}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      flexDirection="row-reverse"
      borderStyle="single"
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
    >
      <Text color="cyan">
        <Text inverse>[ENTER]</Text> - {isLast ? "Leave" : "Next"}
      </Text>
      {!isLast && (
        <Text color="cyan">
          <Text inverse>[ESC]</Text> - {isFirst ? "Leave" : "Back"}
        </Text>
      )}
    </Box>
  );
}
