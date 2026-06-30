"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * A hydration-safe localStorage hook for Next.js App Router.
 *
 * ## How it avoids hydration mismatches
 *
 * 1. **Initial render** always uses `initialValue` (matches server output).
 * 2. After mount, a one-time `useEffect` reads localStorage and reconciles.
 * 3. A `isHydrated` ref prevents the effect from firing more than once.
 * 4. Cross-tab sync via the `storage` event keeps multiple tabs in lock-step.
 *
 * @param key - The localStorage key.
 * @param initialValue - Fallback value when nothing is stored yet.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // ---------- helpers ----------
  const isServer = typeof window === "undefined";

  const readValue = useCallback((): T => {
    if (isServer) return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch (err) {
      console.warn(`[useLocalStorage] Error reading "${key}":`, err);
      return initialValue;
    }
  }, [initialValue, key, isServer]);

  // ---------- state ----------
  // Always start with initialValue so server & client first render match.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Track whether the client-side hydration read has happened.
  const isHydrated = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  // ---------- hydration effect (runs once on mount) ----------
  useEffect(() => {
    if (isHydrated.current) return;
    isHydrated.current = true;

    const persisted = readValue();
    setStoredValue(persisted);
    setHydrated(true);
  }, [readValue]);

  // ---------- setter ----------
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (isServer) {
        console.warn(
          `[useLocalStorage] Cannot set "${key}" during SSR.`,
        );
        return;
      }

      try {
        const newValue =
          value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);

        // Notify other hooks / components on the same page.
        window.dispatchEvent(
          new StorageEvent("local-storage", { key }),
        );
      } catch (err) {
        console.warn(`[useLocalStorage] Error setting "${key}":`, err);
      }
    },
    [isServer, key, storedValue],
  );

  // ---------- cross-tab sync ----------
  useEffect(() => {
    if (isServer) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key !== key) return;
      setStoredValue(readValue());
    };

    // Native cross-tab event
    window.addEventListener("storage", handleStorage);
    // Custom same-tab event (dispatched above)
    window.addEventListener(
      "local-storage" as keyof WindowEventMap,
      handleStorage as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "local-storage" as keyof WindowEventMap,
        handleStorage as EventListener,
      );
    };
  }, [isServer, key, readValue]);

  return [storedValue, setValue, hydrated];
}
