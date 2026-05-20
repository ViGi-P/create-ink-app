import { Box, useWindowSize } from "ink";
import { useState } from "react";
import Header from "./components/header.tsx";
import Footer from "./components/footer.tsx";
import StepperSection from "./components/stepper-section/index.tsx";
import type { AppProperties } from "./types/app-properties.type.ts";
import checkDirectoryExists from "./utils/check-directory-exists.ts";

function getInitialStep(argValues: AppProperties): number {
  if (!!argValues.projectName) {
    if (checkDirectoryExists(argValues.projectName)) {
      return 0;
    } else {
      if (!!argValues.type) {
        if (!!argValues.language) {
          if (!!argValues.install) {
            if (argValues.git === undefined) {
              return 4;
            } else {
              return 5;
            }
          } else {
            return 3;
          }
        } else {
          return 2;
        }
      } else {
        return 1;
      }
    }
  } else {
    return 0;
  }
}

export default function App({ argValues }: { argValues: AppProperties }) {
  const [step, setStep] = useState<number>(() => getInitialStep(argValues));
  const { columns, rows } = useWindowSize();

  return (
    <Box
      flexDirection="column"
      width={columns}
      height={rows}
      minHeight={16}
      rowGap={1}
      borderStyle="round"
    >
      <Header text="@vigi-p/create-ink-app" />
      <StepperSection {...{ argValues, step, setStep }} />
      <Footer isFirst={step === 0} isLast={step === 5} />
    </Box>
  );
}
