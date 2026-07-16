// The waitlist "backend", mocked in one swappable module. Everything the site
// knows about the waitlist — the live count, submissions, referral links —
// flows through here, so wiring up a real service later touches nothing else.
//
// TODO: wire to real backend. Replace the bodies of getWaitlistCount() and
// submitWaitlist() with real API calls; the shapes below are the contract.

export interface WaitlistSubmission {
  firstName: string;
  lastName: string;
  email: string;
}

export interface WaitlistConfirmation {
  /** Personal referral id, embedded in the share link. */
  refId: string;
  /** Skip-the-queue link the member can share. */
  referralUrl: string;
}

// Seeded to a believable pre-launch count; submits nudge it so the number a
// visitor sees stays coherent within their session. Nothing is persisted.
let count = 2847;

export async function getWaitlistCount(): Promise<number> {
  return count;
}

export async function submitWaitlist(
  data: WaitlistSubmission,
): Promise<WaitlistConfirmation> {
  if (!data.firstName.trim() || !data.lastName.trim() || !data.email.trim()) {
    throw new Error("All fields are required.");
  }

  // Simulate the round trip a real submit will make.
  await new Promise((resolve) => setTimeout(resolve, 700));

  count += 1;
  const refId = Math.random().toString(36).slice(2, 10);
  return {
    refId,
    referralUrl: `https://habacus.app/?ref=${refId}`,
  };
}
