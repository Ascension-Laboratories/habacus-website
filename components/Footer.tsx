import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-hairline bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <span className="font-display text-lg text-foreground">
              habacus
            </span>
            <p className="mt-3 font-serif text-sm leading-relaxed text-foreground-muted">
              A ritual companion for consistency — not a tracker. Every bead you
              place is a day you showed up.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-eyebrow text-xs uppercase tracking-[0.14em] text-foreground-faint">
                Company
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground-muted">
                <li>
                  <span className="text-foreground-muted">Ascension Labs</span>
                </li>
                <li>
                  <a
                    href="mailto:hello@habacus.app"
                    className="hover:text-foreground"
                  >
                    hello@habacus.app
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-eyebrow text-xs uppercase tracking-[0.14em] text-foreground-faint">
                Legal
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground-muted">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-foreground-faint">
            © {new Date().getFullYear()} Ascension Labs. All rights reserved.
          </p>
          <p className="font-mono text-xs text-foreground-faint">
            Currently in private beta.
          </p>
        </div>
      </div>
    </footer>
  );
}
