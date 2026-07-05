import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { bookingReducer } from "../../features/bookingSlice";
import BookingForm from "../BookingForm";

function renderWithStore() {
  const store = configureStore({ reducer: { booking: bookingReducer } });
  return render(
    <Provider store={store}>
      <BookingForm />
    </Provider>
  );
}

describe("Booking wizard (integration)", () => {
  it("walks through all three steps and computes a total price", async () => {
    const user = userEvent.setup();
    renderWithStore();

    await user.selectOptions(screen.getByLabelText("Citizenship"), "Turkey");
    await user.selectOptions(screen.getByLabelText("Destination country"), "Italy");
    await user.click(screen.getByLabelText(/Full Board/));

    const startDateInput = screen.getByLabelText("Start date");
    await user.clear(startDateInput);
    await user.type(startDateInput, "2026-09-01");

    const daysInput = screen.getByLabelText("Number of days");
    await user.clear(daysInput);
    await user.type(daysInput, "2");

    await user.click(screen.getByRole("button", { name: /Continue to daily plan/i }));

    await waitFor(() => expect(screen.getByText("Daily plan")).toBeInTheDocument(), { timeout: 2000 });

    const hotelSelects = screen.getAllByLabelText(/Hotel for day/);
    expect(hotelSelects).toHaveLength(2);
    for (const select of hotelSelects) {
      await user.selectOptions(select, "301");
    }

    await user.click(screen.getByRole("button", { name: /Review summary/i }));

    await waitFor(() => expect(screen.getByText("Grand total")).toBeInTheDocument());
    const ticket = screen.getByText("Grand total").closest("div") as HTMLElement;
    expect(within(ticket).getByText("$300")).toBeInTheDocument();
  });
});
