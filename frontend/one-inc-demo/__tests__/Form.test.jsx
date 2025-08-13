import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "../src/Form";

let mockStreamerState = {
  process: vi.fn(),
  cancel: vi.fn(),
  output: "",
  isLoading: false,
  error: null,
};

// Mock the useStreamer hook
vi.mock("../src/useStreamer", () => ({
  useStreamer: () => mockStreamerState,
}));

describe("Form component", () => {
  it("renders input and process button", () => {
    render(<Form />);
    expect(
      screen.getByPlaceholderText(
        "Professional, Casual, Polite, or Something for the Socials..."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Process" })).toBeInTheDocument();
  });

  it("updates input value on submit and renders the cancel button", () => {
    render(<Form />);
    // Test if input appears, set the input value and ensure it's set
    const input = screen.getByPlaceholderText(
      "Professional, Casual, Polite, or Something for the Socials..."
    );
    fireEvent.change(input, { target: { value: "Dummy text" } });
    expect(input.value).toBe("Dummy text");

    // Select the button and click it
    const button = screen.getByRole("button", { name: "Process" });
    fireEvent.click(button);

    // Test that after clicking Process the user's message should appear on the screen
    expect(screen.getByText("Dummy text")).toBeInTheDocument();

    // Test that the cancel button should also appear when isLoading is true
    mockStreamerState.isLoading = true;
    render(<Form />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
