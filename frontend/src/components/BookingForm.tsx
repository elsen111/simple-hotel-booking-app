import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../app/store";
import { generateDailySelections, setStep } from "../features/bookingSlice";
import { selectBooking, selectIsStep1Valid, selectIsStep2Valid } from "../features/selectors";
import Stepper from "./Stepper";
import SaveLoadPanel from "./SaveLoadPanel";
import Step1Config from "./formSteps/Booking";
import Step2DailyPlan from "./formSteps/DailySchedulePlanner";
import Step3Summary from "./formSteps/CheckoutSummary";

export default function BookingForm() {
  const dispatch = useDispatch<AppDispatch>();
  const booking = useSelector(selectBooking);
  const step1Valid = useSelector(selectIsStep1Valid);
  const step2Valid = useSelector(selectIsStep2Valid);

  const furthestUnlocked: 1 | 2 | 3 = !step1Valid ? 1 : !step2Valid ? 2 : 3;

  const handleStepClick = (step: 1 | 2 | 3) => {
    if (step === 2 && booking.dailySelections.length === 0 && step1Valid) {
      dispatch(generateDailySelections());
    }
    dispatch(setStep(step));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Stepper
          currentStep={booking.currentStep}
          furthestUnlocked={furthestUnlocked}
          onStepClick={handleStepClick}
        />
        {booking.currentStep === 1 && <SaveLoadPanel />}
      </div>

      {booking.currentStep === 1 && <Step1Config />}
      {booking.currentStep === 2 && <Step2DailyPlan />}
      {booking.currentStep === 3 && <Step3Summary />}
    </div>
  );
}
