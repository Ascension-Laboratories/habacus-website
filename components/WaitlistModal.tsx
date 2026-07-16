"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  submitWaitlist,
  type WaitlistConfirmation,
  type WaitlistSubmission,
} from "@/lib/waitlist";

// Built on the native <dialog> element: showModal() gives us the top layer,
// an inert page behind the modal (which is what actually traps Tab), Esc
// handling via the cancel event, and an implicit aria-modal. The open/close
// transition lives in globals.css under the reduced-motion override.

const EMPTY: WaitlistSubmission = { firstName: "", lastName: "", email: "" };

type FieldErrors = Partial<Record<keyof WaitlistSubmission | "form", string>>;

// Whether the browser has a native share sheet never changes within a
// session; the server snapshot is false so SSR markup stays deterministic.
const noopSubscribe = () => () => {};
const useCanShare = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => !!navigator.share,
    () => false,
  );

function validate(data: WaitlistSubmission): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.firstName.trim()) errors.firstName = "Add your first name.";
  if (!data.lastName.trim()) errors.lastName = "Add your last name.";
  if (!data.email.trim()) {
    errors.email = "Add your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "That email looks incomplete.";
  }
  return errors;
}

export default function WaitlistModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();
  const fieldId = useId();

  const [fields, setFields] = useState<WaitlistSubmission>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  // Kept after closing: reopening shows the same seat + referral link.
  const [confirmation, setConfirmation] = useState<WaitlistConfirmation | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const canShare = useCanShare();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Hand focus to the confirmation heading so the state change is announced.
  useEffect(() => {
    if (confirmation && isOpen) successHeadingRef.current?.focus();
  }, [confirmation, isOpen]);

  function setField(name: keyof WaitlistSubmission, value: string) {
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      setConfirmation(await submitWaitlist(fields));
    } catch {
      setErrors({ form: "Something slipped. Give it another go." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!confirmation) return;
    try {
      await navigator.clipboard.writeText(confirmation.referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the link is visible and selectable.
    }
  }

  function handleShare() {
    if (!confirmation) return;
    navigator
      .share({
        title: "Habacus",
        text: "Habacus turns your habits into an abacus. Join from my link and we both move up the list.",
        url: confirmation.referralUrl,
      })
      .catch(() => {
        // Visitor dismissed the share sheet.
      });
  }

  const inputClass = (invalid: boolean) =>
    `w-full rounded-[var(--radius-sm)] border bg-background-raised px-4 py-3 text-sm text-foreground placeholder:text-foreground-faint focus:outline-none focus-visible:border-gold/70 disabled:opacity-60 ${
      invalid ? "border-[#c04a5e]/70" : "border-border-hairline-strong"
    }`;

  const field = (
    name: keyof WaitlistSubmission,
    label: string,
    type: string,
    autoComplete: string,
    autoFocus = false,
  ) => (
    <div>
      <label
        htmlFor={`${fieldId}-${name}`}
        className="font-eyebrow text-xs uppercase tracking-[0.14em] text-foreground-muted"
      >
        {label}
      </label>
      <input
        id={`${fieldId}-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        value={fields[name]}
        onChange={(e) => setField(name, e.target.value)}
        disabled={submitting}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${fieldId}-${name}-error` : undefined}
        className={`mt-1.5 ${inputClass(!!errors[name])}`}
      />
      {errors[name] && (
        <p
          id={`${fieldId}-${name}-error`}
          className="mt-1.5 text-xs text-[#e57085]"
        >
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      onClose={onClose}
      // Clicks land on the <dialog> itself only when they miss the panel —
      // i.e. on the backdrop.
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="waitlist-dialog m-auto w-[calc(100%-2rem)] max-w-md rounded-[var(--radius-lg)] border border-border-hairline bg-background-panel p-0 text-foreground shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]"
    >
      <div className="grain relative p-7 sm:p-9">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-foreground-muted transition-colors hover:border-border-hairline hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {confirmation ? (
          <div>
            <h2
              ref={successHeadingRef}
              tabIndex={-1}
              id={titleId}
              className="font-display text-3xl text-foreground focus:outline-none"
            >
              You&apos;re on the list.
            </h2>
            <p className="font-serif mt-3 text-base leading-relaxed text-foreground-muted">
              We&apos;ll be in contact when a seat&apos;s available.
            </p>

            <div className="mt-7 rounded-[var(--radius-md)] border border-border-hairline bg-background-raised p-5">
              <p className="font-eyebrow text-xs uppercase tracking-[0.2em] text-gold">
                Move up the list
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                Every friend who joins from your link bumps you up. Drop it in
                the group chat.
              </p>
              <p className="font-mono mt-4 truncate rounded-[var(--radius-sm)] border border-border-hairline px-3 py-2.5 text-xs text-foreground">
                {confirmation.referralUrl}
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-full bg-gold px-6 py-2.5 font-eyebrow text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-gold-bright"
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
                {canShare && (
                  <button
                    type="button"
                    onClick={handleShare}
                    className="rounded-full border border-border-hairline-strong px-6 py-2.5 font-eyebrow text-[13px] uppercase tracking-[0.1em] text-foreground-muted transition-colors hover:border-gold/50 hover:text-foreground"
                  >
                    Share
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 id={titleId} className="font-display text-3xl text-foreground">
              Join early access
            </h2>
            <p className="font-serif mt-3 text-base leading-relaxed text-foreground-muted">
              Leave your details and we&apos;ll be in contact when a
              seat&apos;s available.
            </p>

            <div className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {field("firstName", "First name", "text", "given-name", true)}
                {field("lastName", "Last name", "text", "family-name")}
              </div>
              {field("email", "Email", "email", "email")}
            </div>

            {errors.form && (
              <p role="alert" className="mt-4 text-sm text-[#e57085]">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 w-full rounded-full bg-gold px-8 py-3.5 font-eyebrow text-sm uppercase tracking-[0.1em] text-background transition-colors hover:bg-gold-bright disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Saving your seat…" : "Request early access"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
