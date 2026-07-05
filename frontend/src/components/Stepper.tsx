import clsx from "clsx";

interface StepDef {
  step: 1 | 2 | 3;
  label: string;
  sublabel: string;
}

const STEPS: StepDef[] = [
  { step: 1, label: "Itinerary", sublabel: "Destination & dates" },
  { step: 2, label: "Board", sublabel: "Hotel & meals per day" },
  { step: 3, label: "Ticket", sublabel: "Summary & total" },
];

interface StepperProps {
  currentStep: 1 | 2 | 3;
  furthestUnlocked: 1 | 2 | 3;
  onStepClick: (step: 1 | 2 | 3) => void;
}

export default function Stepper({ currentStep, furthestUnlocked, onStepClick }: StepperProps) {
  return (
    <ol className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
      {STEPS.map(({ step, label, sublabel }, index) => {
        const isActive = step === currentStep;
        const isComplete = step < currentStep;
        const isUnlocked = step <= furthestUnlocked;

        return (
          <li key={step} className="flex flex-1 items-center">
            <button
              type="button"
              disabled={!isUnlocked}
              onClick={() => onStepClick(step)}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-2 py-1 text-left transition disabled:cursor-not-allowed",
                isUnlocked && !isActive && "cursor-pointer hover:bg-sand-dark/60"
              )}
            >
              <span
                className={clsx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono-num text-sm font-semibold transition",
                  isActive && "bg-coral text-white",
                  isComplete && !isActive && "bg-teal text-white",
                  !isActive && !isComplete && "bg-sand-dark text-ink-soft"
                )}
              >
                {String(step).padStart(2, "0")}
              </span>

              <span className="flex flex-col">
                <span
                  className={clsx(
                    "font-display text-sm font-semibold leading-tight",
                    isActive ? "text-ink" : "text-ink-soft"
                  )}
                >
                  {label}
                </span>
                <span className="text-xs text-ink-soft/80">{sublabel}</span>
              </span>
            </button>

            {index < STEPS.length - 1 && (
              <span className="mx-3 hidden h-px flex-1 bg-sand-darker sm:block" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
