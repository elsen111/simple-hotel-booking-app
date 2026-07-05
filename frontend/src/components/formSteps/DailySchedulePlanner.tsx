import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { setStep, updateDailySelection } from "../../features/bookingSlice";
import {
  selectBooking,
  selectHotelsForDestination,
  selectMealsForDestination,
  selectIsStep2Valid,
  selectDayPriceBreakdown,
} from "../../features/selectors";
import { applyMealSelection, isMealFieldEnabled } from "../../utils/mealRules";
import { formatDisplayDate } from "../../utils/dates";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function Step2DailyPlan() {
  const dispatch = useDispatch<AppDispatch>();
  const booking = useSelector(selectBooking);
  const hotelOptions = useSelector(selectHotelsForDestination);
  const mealOptions = useSelector(selectMealsForDestination);
  const isValid = useSelector(selectIsStep2Valid);
  const breakdown = useSelector(selectDayPriceBreakdown);

  const boardType = booking.boardType;

  return (
    <Card className="animate-fade-up">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">Daily plan</h2>
        <span className="text-xs uppercase tracking-wide text-ink-soft/70">Step 2 of 3</span>
      </div>
      <p className="mb-5 text-sm text-ink-soft">
        Choose a hotel for each night. {boardType === "NB" && "No meals are included with No Board."}
        {boardType === "HB" && "Half Board lets you pick lunch OR dinner, not both."}
        {boardType === "FB" && "Full Board includes both lunch and dinner."}
      </p>

      <div className="overflow-x-auto rounded-lg border border-sand-darker">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-sand-dark/70">
            <tr>
              <th className="border-b border-sand-darker px-3 py-3 text-left font-display font-semibold">Day</th>
              <th className="border-b border-sand-darker px-3 py-3 text-left font-display font-semibold">Hotel</th>
              <th className="border-b border-sand-darker px-3 py-3 text-left font-display font-semibold">Lunch</th>
              <th className="border-b border-sand-darker px-3 py-3 text-left font-display font-semibold">Dinner</th>
              <th className="border-b border-sand-darker px-3 py-3 text-right font-display font-semibold">Day total</th>
            </tr>
          </thead>

          <tbody>
            {booking.dailySelections.map((day, index) => {
              const lunchEnabled = isMealFieldEnabled(boardType, "lunchId", day);
              const dinnerEnabled = isMealFieldEnabled(boardType, "dinnerId", day);
              const dayTotal = breakdown[index]?.dayTotal ?? 0;

              return (
                <tr key={day.date} className="border-b border-sand-darker/70 last:border-none hover:bg-sand/60">
                  <td className="px-3 py-3 align-top">
                    <div className="font-mono-num text-xs text-ink-soft">Day {index + 1}</div>
                    <div className="font-medium">{formatDisplayDate(day.date)}</div>
                  </td>

                  <td className="px-3 py-3 align-top">
                    <select
                      aria-label={`Hotel for day ${index + 1}`}
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-teal focus:outline-none"
                      value={day.hotelId ?? ""}
                      onChange={(event) =>
                        dispatch(
                          updateDailySelection({
                            index,
                            selection: { hotelId: event.target.value ? Number(event.target.value) : null },
                          })
                        )
                      }
                    >
                      <option value="">Select hotel…</option>
                      {hotelOptions.map((hotel) => (
                        <option key={hotel.id} value={hotel.id}>
                          {hotel.name} (${hotel.price}/night)
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-3 align-top">
                    <select
                      aria-label={`Lunch for day ${index + 1}`}
                      disabled={!lunchEnabled}
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-teal focus:outline-none disabled:cursor-not-allowed disabled:bg-sand-dark/50 disabled:text-ink-soft/60"
                      value={day.lunchId ?? ""}
                      onChange={(event) => {
                        const value = event.target.value ? Number(event.target.value) : null;
                        dispatch(
                          updateDailySelection({
                            index,
                            selection: applyMealSelection(day, boardType, "lunchId", value),
                          })
                        );
                      }}
                    >
                      <option value="">{lunchEnabled ? "None" : "Not included"}</option>
                      {mealOptions?.lunch.map((meal) => (
                        <option key={meal.id} value={meal.id}>
                          {meal.name} (${meal.price})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-3 align-top">
                    <select
                      aria-label={`Dinner for day ${index + 1}`}
                      disabled={!dinnerEnabled}
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-teal focus:outline-none disabled:cursor-not-allowed disabled:bg-sand-dark/50 disabled:text-ink-soft/60"
                      value={day.dinnerId ?? ""}
                      onChange={(event) => {
                        const value = event.target.value ? Number(event.target.value) : null;
                        dispatch(
                          updateDailySelection({
                            index,
                            selection: applyMealSelection(day, boardType, "dinnerId", value),
                          })
                        );
                      }}
                    >
                      <option value="">{dinnerEnabled ? "None" : "Not included"}</option>
                      {mealOptions?.dinner.map((meal) => (
                        <option key={meal.id} value={meal.id}>
                          {meal.name} (${meal.price})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-3 text-right align-top font-mono-num font-semibold">
                    ${dayTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!isValid && (
        <p className="mt-3 text-sm text-red-500">Select a hotel for every day before continuing.</p>
      )}

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => dispatch(setStep(1))}
          variant="secondary"
        >
          &larr; Back
        </Button>
        <Button
          onClick={() => dispatch(setStep(3))}
          disabled={!isValid}
          >
          Review summary &rarr;
        </Button>
      </div>
    </Card>
  );
}
