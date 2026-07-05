import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { loadBooking } from "../features/bookingSlice";
import { deleteSavedBooking, listSavedBookings } from "../utils/storage";
import type { SavedBooking } from "../types/booking.types";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function SaveLoadPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const [savedBookings, setSavedBookings] = useState<SavedBooking[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (!isOpen) setSavedBookings(listSavedBookings());
    setIsOpen((open) => !open);
  };

  const handleLoad = (booking: SavedBooking) => {
    dispatch(loadBooking(booking.state));
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSavedBooking(id);
    setSavedBookings(listSavedBookings());
  };

  return (
    <div className="no-print">
      <button
        type="button"
        onClick={toggleOpen}
        className="text-sm font-medium cursor-pointer text-teal hover:opacity-80 hover:text-teal-dark"
      >
        {isOpen ? "Hide saved bookings" : "Load a saved booking"}
      </button>

      {isOpen && (
        <Card className="mt-3 animate-fade-in">
          {savedBookings.length === 0 ? (
            <p className="text-sm text-ink-soft">
              No saved bookings yet. Configure a trip and save it from the summary step.
            </p>
          ) : (
            <ul className="divide-y divide-sand-darker">
              {savedBookings.map((booking) => (
                <li key={booking.id} className="flex items-center justify-between gap-3 py-2">
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-xs text-ink-soft">
                      {booking.state.destination || "No destination"} &middot;{" "}
                      {new Date(booking.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleLoad(booking)}>
                      Load
                    </Button>
                    <Button variant="outline" onClick={() => handleDelete(booking.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
