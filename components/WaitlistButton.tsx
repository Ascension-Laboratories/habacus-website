"use client";

import { useWaitlist } from "@/components/WaitlistProvider";

/** A CTA that opens the shared waitlist modal; styling comes from the caller. */
export default function WaitlistButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useWaitlist();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
