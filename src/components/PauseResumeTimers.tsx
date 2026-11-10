import { useEffect, useState } from "react";
import { getAcitveWindow } from "../utils/chromeApis/getCurrentAcitivewindow";

type IntervalController = {
  isPaused: () => boolean;
  toggle: () => boolean;
};

declare global {
  interface Window {
    __pwStudyIntervalController?: IntervalController;
  }
}

const getIntervalPauseState = async (tabId: number) => {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: () => window.__pwStudyIntervalController?.isPaused(),
  });

  return result?.result;
};

const PauseResumeTimers = () => {
  const [isPaused, setIsPaused] = useState<boolean | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPauseState = async () => {
      try {
        const activeTab = await getAcitveWindow();
        if (typeof activeTab?.id !== "number") return;

        const paused = await getIntervalPauseState(activeTab.id);
        if (cancelled) return;

        if (typeof paused === "boolean") {
          setIsPaused(paused);
        } else {
          setError("Reload the page to start timer control.");
        }
      } catch (stateError) {
        console.error("Failed to read page timer state:", stateError);
        if (!cancelled) {
          setError("Timer control unavailable on this page.");
        }
      }
    };

    void loadPauseState();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleIntervals = async () => {
    setIsBusy(true);
    setError("");

    try {
      const activeTab = await getAcitveWindow();
      if (typeof activeTab?.id !== "number") {
        throw new Error("No active browser tab found.");
      }

      const [result] = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        world: "MAIN",
        func: () => window.__pwStudyIntervalController?.toggle(),
      });

      if (typeof result?.result !== "boolean") {
        throw new Error("Reload this page, then try pausing its timers again.");
      }

      setIsPaused(result.result);
    } catch (toggleError) {
      console.error("Failed to toggle page timers:", toggleError);
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Failed to toggle page timers.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const label = error
    ? error.includes("Reload")
      ? "Reload Page + Retry"
      : "Timers Unavailable"
    : isPaused === true
      ? "Resume DOM Timers"
      : isPaused === false
        ? "Pause DOM Timers"
        : "Checking DOM Timers...";

  return (
    <button
      type="button"
      onClick={toggleIntervals}
      disabled={isBusy}
      title={error || "Pause or resume the page's setInterval timers"}
      aria-label={error || label}
    >
      {isBusy ? "Working..." : label}
    </button>
  );
};

export default PauseResumeTimers;
