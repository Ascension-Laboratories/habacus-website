import type { Metadata } from "next";
import { LegalDoc, Section } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service — Habacus",
  description: "The terms that govern your use of Habacus.",
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="15 July 2026"
      intro="These terms cover your use of the Habacus app and this website. By creating an account or using Habacus, you agree to them."
    >
      <Section heading="1. Who these terms are with">
        <p>
          Habacus is provided by Ascension Labs (&quot;Ascension Labs,&quot;
          &quot;we,&quot; &quot;us&quot;). References to &quot;you&quot; mean
          the person using the app or this website.
        </p>
      </Section>

      <Section heading="2. The service">
        <p>
          Habacus is a habit-consistency app built around an abacus
          metaphor: you log habits by &quot;sliding a bead,&quot; view a
          rolling-consistency view of your history, and optionally share
          your progress with friends in a daily feed. Habacus is currently
          in private beta — features, availability, and pricing may change
          as we keep building.
        </p>
      </Section>

      <Section heading="3. Accounts">
        <p>
          You need an account to use Habacus, created and authenticated via
          Auth0. You&apos;re responsible for keeping your login credentials
          secure and for anything that happens under your account. You must
          be at least 13 years old (or the minimum age of digital consent
          where you live) to use Habacus, and you agree to give us accurate
          information when you sign up.
        </p>
      </Section>

      <Section heading="4. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use Habacus to harass, shame, or pressure another user — including via the nudge feature;</li>
          <li>Attempt to access another user&apos;s account or data without authorization;</li>
          <li>Scrape, reverse-engineer, or interfere with the app or backend;</li>
          <li>Use the friends/contacts features to spam people who haven&apos;t consented to being contacted;</li>
          <li>Use the service for anything unlawful, or that infringes someone else&apos;s rights.</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules.
        </p>
      </Section>

      <Section heading="5. Your content and data">
        <p>
          You own the habit names, notes, and other content you put into
          Habacus. By using the app, you grant us a limited license to
          store, process, and display that content back to you (and, where
          you&apos;ve chosen to share it, to your accepted friends) so the
          service can function. See our{" "}
          <a href="/privacy" className="text-gold-bright hover:underline">
            Privacy Policy
          </a>{" "}
          for exactly what&apos;s shared with friends today — notably, our
          Friends feature does not yet support per-habit privacy controls,
          so anything you log is visible to all of your accepted friends.
        </p>
      </Section>

      <Section heading="6. Social features">
        <p>
          Reactions, encouragement notes, and nudges are meant to be
          supportive, not competitive or coercive. Nudges are rate-limited
          on our end to prevent pile-on. We may remove social content or
          restrict the feature for accounts that use it to pressure or
          harass others.
        </p>
      </Section>

      <Section heading="7. Pricing">
        <p>
          Habacus is currently free during private beta. We may introduce
          optional premium features or a subscription tier in the future;
          if we do, we&apos;ll tell you clearly before charging you
          anything, and existing free functionality won&apos;t be pulled out
          from under you without notice.
        </p>
      </Section>

      <Section heading="8. Intellectual property">
        <p>
          The Habacus name, logo, app design, and underlying software are
          owned by Ascension Labs and protected by intellectual property
          law. These terms don&apos;t grant you any rights to our
          trademarks or branding beyond what&apos;s needed to use the app
          normally.
        </p>
      </Section>

      <Section heading="9. Third-party services">
        <p>
          Habacus relies on third-party services — including Auth0 for
          authentication and Apple&apos;s App Store for distribution — whose
          own terms may also apply to you.
        </p>
      </Section>

      <Section heading="10. Disclaimers">
        <p>
          Habacus is a consistency and habit-support tool, not medical,
          psychological, or professional advice of any kind. The app is
          provided &quot;as is&quot; and &quot;as available,&quot; without
          warranties of any kind, express or implied. We don&apos;t
          guarantee the service will be uninterrupted, error-free, or
          available at all times — it&apos;s an early-stage, actively
          changing product.
        </p>
      </Section>

      <Section heading="11. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Ascension Labs won&apos;t
          be liable for any indirect, incidental, or consequential damages
          arising from your use of Habacus. Nothing in these terms limits
          liability that can&apos;t legally be limited, such as liability
          for death or personal injury caused by our negligence, or fraud.
        </p>
      </Section>

      <Section heading="12. Termination">
        <p>
          You can stop using Habacus and delete your account at any time.
          We may suspend or terminate your access if you violate these
          terms, or discontinue the service (or features of it) with
          reasonable notice where practical.
        </p>
      </Section>

      <Section heading="13. Governing law">
        <p>
          These terms are governed by the laws of England and Wales,
          without regard to conflict-of-law principles. If you&apos;re a
          consumer resident elsewhere, mandatory local consumer-protection
          laws in your country may still apply.
        </p>
      </Section>

      <Section heading="14. Changes to these terms">
        <p>
          We may update these terms as Habacus evolves. We&apos;ll update
          the &quot;last updated&quot; date above, and for significant
          changes, we&apos;ll try to notify you directly in the app.
        </p>
      </Section>

      <Section heading="15. Contact">
        <p>
          Questions about these terms? Email{" "}
          <a
            href="mailto:hello@habacus.app"
            className="text-gold-bright hover:underline"
          >
            hello@habacus.app
          </a>
          .
        </p>
      </Section>

      <p className="font-mono border-t border-border-hairline pt-8 text-xs text-foreground-faint">
        This is a plain-language draft written for a beta-stage product —
        it isn&apos;t legal advice. Have a lawyer review it before relying
        on it for an App Store submission or in a jurisdiction with
        specific requirements.
      </p>
    </LegalDoc>
  );
}
