import { Box } from "ink";
import { useEffect, useState } from "react";
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
  const [dim, setDim] = useState<{ width: number; height: number }>({
    width: process.stdout.columns,
    height: process.stdout.rows,
  });

  useEffect(() => {
    const handleResize = () => {
      setDim({ width: process.stdout.columns, height: process.stdout.rows });
    };

    process.stdout.on("resize", handleResize);
    return () => {
      process.stdout.off("resize", handleResize);
    };
  }, []);

  return (
    <Box
      flexDirection="column"
      width={dim.width}
      height={dim.height}
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
