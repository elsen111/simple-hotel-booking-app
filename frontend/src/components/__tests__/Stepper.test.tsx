import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Stepper from "../Stepper";

describe("Stepper", () => {
  it("renders all three steps", () => {
    render(<Stepper currentStep={1} furthestUnlocked={1} onStepClick={() => {}} />);
    expect(screen.getByText("Itinerary")).toBeInTheDocument();
    expect(screen.getByText("Board")).toBeInTheDocument();
    expect(screen.getByText("Ticket")).toBeInTheDocument();
  });

  it("disables steps beyond the furthest unlocked step", () => {
    render(<Stepper currentStep={1} furthestUnlocked={1} onStepClick={() => {}} />);
    expect(screen.getByText("Board").closest("button")).toBeDisabled();
    expect(screen.getByText("Ticket").closest("button")).toBeDisabled();
  });

  it("calls onStepClick when an unlocked step is clicked", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper currentStep={2} furthestUnlocked={2} onStepClick={onStepClick} />);

    await user.click(screen.getByText("Itinerary"));
    expect(onStepClick).toHaveBeenCalledWith(1);
  });
});
