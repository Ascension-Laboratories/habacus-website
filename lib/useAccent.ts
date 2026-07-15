"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  ACCENTS,
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  applyAccent,
  isAccentName,
  type Accent,
  type AccentName,
} from "@/lib/accents";

// The selected gem lives in localStorage, which is external state: the hook
// below subscribes to it rather than mirroring it into React state, so every
// accent-aware component re-renders off one source.

let current: AccentName | null = null;
const listeners = new Set<() => void>();

function read(): AccentName {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(ACCENT_STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode, blocked cookies) — use the default.
  }
  return isAccentName(stored) ? stored : DEFAULT_ACCENT;
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  // Keep tabs in agreement when the gem is changed in another one.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== ACCENT_STORAGE_KEY) return;
    current = isAccentName(e.newValue) ? e.newValue : DEFAULT_ACCENT;
    applyAccent(current);
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

// Cached so repeated renders get a stable reference; React requires getSnapshot
// to be idempotent between store changes.
function getSnapshot(): AccentName {
  if (current === null) current = read();
  return current;
}

// The bootstrap script has already painted the stored gem's variables, but the
// server rendered the default — hydrate against the default, then let React
// swap to the real snapshot.
function getServerSnapshot(): AccentName {
  return DEFAULT_ACCENT;
}

export function useAccent(): { accent: Accent; setAccent: (n: AccentName) => void } {
  const name = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setAccent = useCallback((next: AccentName) => {
    current = next;
    applyAccent(next);
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, next);
    } catch {
      // Preference is session-only if storage is unavailable.
    }
    emit();
  }, []);

  return { accent: ACCENTS[name], setAccent };
}
