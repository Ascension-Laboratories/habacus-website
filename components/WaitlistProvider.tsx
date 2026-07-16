"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import WaitlistModal from "@/components/WaitlistModal";

// Every "Join / Request early access" CTA on the page opens the same modal, so
// the open() handle lives in context and the dialog itself is mounted once,
// here, above the page tree.

const WaitlistContext = createContext<{ open: () => void } | null>(null);

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) {
    throw new Error("useWaitlist must be used inside <WaitlistProvider>");
  }
  return ctx;
}

export default function WaitlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // The element that opened the modal, so closing can hand focus back to it.
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    triggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  return (
    <WaitlistContext.Provider value={{ open }}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={close} />
    </WaitlistContext.Provider>
  );
}
