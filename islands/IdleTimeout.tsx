/**
 * Idle Timeout Island
 * Shows warning modal after inactivity, auto-logs out if no response
 */

import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface Props {
  /** Minutes of inactivity before showing warning (default: 10) */
  warningAfterMinutes?: number;
  /** Minutes on countdown timer in warning (default: 5) */
  countdownMinutes?: number;
  /** URL to redirect to on logout */
  logoutUrl?: string;
}

export default function IdleTimeout({
  warningAfterMinutes = 10,
  countdownMinutes = 5,
  logoutUrl = "/logout",
}: Props) {
  const showWarning = useSignal(false);
  const secondsRemaining = useSignal(countdownMinutes * 60);
  const lastActivity = useSignal(Date.now());

  useEffect(() => {
    const warningMs = warningAfterMinutes * 60 * 1000;
    const countdownMs = countdownMinutes * 60 * 1000;

    // Track user activity
    const resetActivity = () => {
      if (!showWarning.value) {
        lastActivity.value = Date.now();
      }
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      document.addEventListener(event, resetActivity, { passive: true });
    });

    // Check for inactivity every 10 seconds
    const checkInterval = setInterval(() => {
      const idleTime = Date.now() - lastActivity.value;

      if (!showWarning.value && idleTime >= warningMs) {
        // Show warning and start countdown
        showWarning.value = true;
        secondsRemaining.value = countdownMinutes * 60;
      }
    }, 10000);

    // Countdown timer (runs every second when warning is shown)
    const countdownInterval = setInterval(() => {
      if (showWarning.value) {
        secondsRemaining.value -= 1;

        if (secondsRemaining.value <= 0) {
          // Time's up - log out
          window.location.href = logoutUrl;
        }
      }
    }, 1000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetActivity);
      });
      clearInterval(checkInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const stayLoggedIn = () => {
    showWarning.value = false;
    lastActivity.value = Date.now();
    secondsRemaining.value = countdownMinutes * 60;
  };

  const logoutNow = () => {
    window.location.href = logoutUrl;
  };

  // Format seconds as M:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!showWarning.value) {
    return null;
  }

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div class="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
        <div class="text-center mb-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Are you still there?
          </h2>
          <p class="text-gray-600 text-sm">
            You'll be logged out due to inactivity in
          </p>
          <p class="text-3xl font-bold text-gray-900 mt-2 font-mono">
            {formatTime(secondsRemaining.value)}
          </p>
        </div>

        <div class="space-y-3">
          <button
            type="button"
            onClick={stayLoggedIn}
            class="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors"
          >
            Stay Logged In
          </button>
          <button
            type="button"
            onClick={logoutNow}
            class="w-full py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
          >
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
}
