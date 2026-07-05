import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { resetBooking, setStep } from "../../features/bookingSlice";
import { selectBooking, selectDayPriceBreakdown, selectGrandTotal } from "../../features/selectors";
import { boardTypes } from "../../data/boards";
import { formatDisplayDate, getEndDate } from "../../utils/dates";
import { saveBooking } from "../../utils/storage";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function Step3Summary() {
  const dispatch = useDispatch<AppDispatch>();
  const booking = useSelector(selectBooking);
  const breakdown = useSelector(selectDayPriceBreakdown);
  const grandTotal = useSelector(selectGrandTotal);
  const [saveName, setSaveName] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const board = boardTypes.find((b) => b.code === booking.boardType);
  const endDate = getEndDate(booking.startDate, booking.days);

  const handlePrint = () => window.print();

  const handleSave = () => {
    saveBooking(saveName, booking);
    setSaveMessage(`Saved as "${saveName.trim() || "Untitled booking"}".`);
    setSaveName("");
    window.setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="animate-fade-up space-y-6">
      <Card title="Configuration summary">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-soft/70">Citizenship</dt>
            <dd className="font-medium">{booking.citizenship}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-soft/70">Destination</dt>
            <dd className="font-medium">{booking.destination}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-soft/70">Board type</dt>
            <dd className="font-medium">{board?.name} ({board?.code})</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-soft/70">Dates</dt>
            <dd className="font-medium font-mono-num">
              {formatDisplayDate(booking.startDate)} &rarr; {formatDisplayDate(endDate)}
            </dd>
          </div>
        </dl>
      </Card>

      <Card title="Daily selections">
        <ul className="divide-y divide-sand-darker">
          {breakdown.map((day, index) => (
            <li key={day.date} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-mono-num text-xs text-ink-soft">Day {index + 1} &middot; {formatDisplayDate(day.date)}</span>
                <p className="font-medium">{day.hotelName ?? "No hotel selected"}</p>
                <p className="text-sm text-ink-soft">
                  {day.lunchName && `Lunch: ${day.lunchName}`}
                  {day.lunchName && day.dinnerName && " · "}
                  {day.dinnerName && `Dinner: ${day.dinnerName}`}
                  {!day.lunchName && !day.dinnerName && "No meals selected"}
                </p>
              </div>
              <span className="font-mono-num font-semibold sm:text-right">${day.dayTotal}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="print-area relative overflow-hidden rounded-xl border border-sand-darker bg-teal text-white shadow-md">
        <div className="absolute -right-4 top-4 rotate-[-8deg] rounded border-2 border-coral-light px-3 py-1 text-xs font-bold uppercase tracking-widest text-coral-light stamp">
          Confirmed
        </div>

        <div className="grid gap-0 sm:grid-cols-[1fr_auto_1fr]">
          <div className="p-6">
            <p className="text-xs uppercase tracking-widest text-teal-light">Total price calculation</p>
            <h3 className="mt-1 font-display text-lg font-semibold">Trip breakdown</h3>

            <table className="mt-4 w-full text-sm">
              <tbody>
                {breakdown.map((day, index) => (
                  <tr key={day.date} className="border-b border-white/10">
                    <td className="py-1.5 pr-2 text-teal-light">Day {index + 1}</td>
                    <td className="py-1.5 pr-2">{day.hotelName ?? "—"}</td>
                    <td className="py-1.5 text-right font-mono-num">${day.dayTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="perforation-vertical hidden sm:block" aria-hidden="true">
            <div className="h-full w-px bg-white/20" style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 8px, transparent 8px, transparent 16px)",
            }} />
          </div>

          <div className="ticket-notch flex flex-col justify-center bg-teal-dark p-6">
            <p className="text-xs uppercase tracking-widest text-teal-light">Grand total</p>
            <p className="mt-1 font-mono-num text-4xl font-bold">${grandTotal}</p>
            <p className="mt-1 text-xs text-teal-light">
              {booking.days} night{booking.days === 1 ? "" : "s"} &middot; {booking.destination}
            </p>
          </div>
        </div>
      </div>

      <Card title="Save this booking" className="no-print">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="save-name" className="mb-1 block text-sm font-medium">Name</label>
            <input
              id="save-name"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-teal focus:outline-none"
              placeholder="e.g. Summer trip to Italy"
              value={saveName}
              onChange={(event) => setSaveName(event.target.value)}
            />
          </div>
          <Button onClick={handleSave} variant="accent">
            Save booking
          </Button>
        </div>
        {saveMessage && <p className="mt-2 text-sm text-teal">{saveMessage}</p>}
      </Card>

      <div className="no-print flex flex-wrap justify-between gap-3">
        <Button onClick={() => dispatch(setStep(2))} variant="secondary">
          &larr; Back to daily plan
        </Button>
        <div className="flex gap-3">
          <Button onClick={handlePrint} variant="outline">
            Print / Export PDF
          </Button>
          <Button onClick={() => dispatch(resetBooking())}>
            Start a new booking
          </Button>
        </div>
      </div>
    </div>
  );
}
