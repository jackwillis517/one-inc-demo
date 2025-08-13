import { render, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useStreamer } from "../src/useStreamer";

// Replacement for renderHook utility from @testing-library/react-hooks
async function customRenderHook(hook) {
  const result = { current: null };

  function HookWrapper() {
    result.current = hook();
    return null;
  }

  //   render(<HookWrapper />);
  await act(async () => {
    render(<HookWrapper />);
  });
  return result;
}

// Mock fetch for streaming and cancel endpoints
globalThis.fetch = vi.fn();

describe("useStreamer hook", () => {
  it("should initialize with default values", async () => {
    const result = await customRenderHook(() =>
      useStreamer("/api/generate", "/api/cancel")
    );

    expect(result.current.output).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should call process and set isLoading", async () => {
    // Mock fetch to use my own readable stream not a real openai call
    globalThis.fetch.mockResolvedValueOnce({
      body: new ReadableStream({
        async start(controller) {
          await new Promise((r) => setTimeout(r, 10)); // wait 10ms
          controller.enqueue(new TextEncoder().encode("Test output"));
          controller.close();
        },
      }),
      ok: true,
    });

    const result = await customRenderHook(() =>
      useStreamer("/api/generate", "/api/cancel")
    );

    act(() => {
      result.current.process("Dummy text");
    });

    expect(result.current.isLoading).toBe(true);
  });
});
