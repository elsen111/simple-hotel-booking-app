import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { generateDailySelections, setBookingInfo, setStep } from "../../features/bookingSlice";
import { selectBooking } from "../../features/selectors";
import { countries } from "../../data/countries";
import { boardTypes } from "../../data/boards";
import type { BoardCode } from "../../types/data.types";
import { validateStep1 } from "../../utils/validation";
import Card from "../ui/Card";
import Select from "../ui/Select";
import Input from "../ui/Input";
import RadioGroup from "../ui/RadioGroup";
import Button from "../ui/Button";
import LoadingSkeleton from "../LoadingSkeleton";
import ErrorMessage from "../ErrorMessage";

const countryOptions = countries.map((country) => ({ value: country.name, label: country.name }));
const boardOptions = boardTypes.map((board) => ({ value: board.code, label: `${board.name} (${board.code})` }));

export default function Step1Config() {
  const dispatch = useDispatch<AppDispatch>();
  const booking = useSelector(selectBooking);
  const [touched, setTouched] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const errors = useMemo(() => validateStep1(booking), [booking]);
  const activeBoard = boardTypes.find((board) => board.code === booking.boardType);

  const handleContinue = () => {
    setTouched(true);
    if (Object.keys(errors).length > 0) return;

    setIsGenerating(true);
    window.setTimeout(() => {
      dispatch(generateDailySelections());
      dispatch(setStep(2));
      setIsGenerating(false);
    }, 500);
  };

  if (isGenerating) {
    return <LoadingSkeleton label="Drafting your itinerary…" />;
  }

  return (
    <Card className="animate-fade-up">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">Plan your trip</h2>
        <span className="text-xs uppercase tracking-wide text-ink-soft/70">Step 1 of 3</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          id="citizenship"
          label="Citizenship"
          options={countryOptions}
          value={booking.citizenship}
          error={touched ? errors.citizenship : undefined}
          onChange={(event) => dispatch(setBookingInfo({ citizenship: event.target.value }))}
        />

        <Select
          id="destination"
          label="Destination country"
          options={countryOptions}
          value={booking.destination}
          error={touched ? errors.destination : undefined}
          onChange={(event) => dispatch(setBookingInfo({ destination: event.target.value }))}
        />

        <Input
          id="startDate"
          type="date"
          label="Start date"
          value={booking.startDate}
          error={touched ? errors.startDate : undefined}
          onChange={(event) => dispatch(setBookingInfo({ startDate: event.target.value }))}
        />

        <Input
          id="days"
          type="number"
          min={1}
          max={60}
          label="Number of days"
          value={booking.days}
          error={touched ? errors.days : undefined}
          onChange={(event) => dispatch(setBookingInfo({ days: Number(event.target.value) }))}
        />
      </div>

      <div className="mt-5">
        <RadioGroup
          label="Board type"
          name="boardType"
          value={booking.boardType}
          options={boardOptions}
          onChange={(value) => dispatch(setBookingInfo({ boardType: value as BoardCode }))}
        />
        {touched && <ErrorMessage message={errors.boardType} />}
        {activeBoard && (
          <p className="mt-2 text-sm text-ink-soft">{activeBoard.description}.</p>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleContinue}>
          Continue to daily plan &rarr;
        </Button>
      </div>
    </Card>
  );
}
