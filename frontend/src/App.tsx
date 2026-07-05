import BookingForm from "./components/BookingForm";

function App() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="no-print mb-8">
        <p className="font-mono-num text-xs uppercase tracking-[0.3em] text-coral">Boarding Pass</p>
        <h1 className="mt-1 font-display text-4xl font-bold text-ink">Hotel Booking App</h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          Pick a destination, plan your board type day by day, and get a priced itinerary you can save or print.
        </p>
      </header>

      <BookingForm />
    </div>
  );
}

export default App;
