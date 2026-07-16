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
      intro="These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Habacus application and this website. By creating an account or otherwise using Habacus, you agree to be bound by these Terms."
    >
      <Section heading="1. Parties">
        <p>
          Habacus is provided by Ascension Labs (&quot;Ascension Labs,&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). &quot;You&quot;
          means the individual using the application or this website.
        </p>
      </Section>

      <Section heading="2. The service">
        <p>
          Habacus is a habit-consistency application that allows users to
          record habit completions, view a history of their consistency,
          and, at their option, share their progress with other users. The
          service is currently offered in private beta. Features,
          availability, and pricing may change, and functionality may be
          added, modified, or withdrawn at our discretion.
        </p>
      </Section>

      <Section heading="3. Accounts">
        <p>
          Use of Habacus requires an account. Account credentials are
          created and authenticated using a specialised third-party
          identity provider; we do not directly store your password. You
          are responsible for maintaining the confidentiality of your
          credentials and for all activity occurring under your account.
          You must be at least 13 years of age, or the minimum age of
          digital consent in your jurisdiction, to use Habacus, and you
          agree to provide accurate information when registering.
        </p>
      </Section>

      <Section heading="4. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>use Habacus to harass, shame, or pressure another user, including through the nudge feature;</li>
          <li>attempt to access another user&apos;s account or data without authorization;</li>
          <li>scrape, reverse-engineer, or interfere with the application or its underlying systems;</li>
          <li>use the friends or contacts features to contact individuals who have not consented to being contacted; or</li>
          <li>use the service for any unlawful purpose or in a manner that infringes the rights of any third party.</li>
        </ul>
        <p>
          We may suspend or terminate any account found to be in breach of
          this section.
        </p>
      </Section>

      <Section heading="5. Your content and data">
        <p>
          As between you and us, you retain ownership of the habit names,
          notes, and other content you submit to Habacus (&quot;User
          Content&quot;). By submitting User Content, you grant us a
          limited, non-exclusive license to store, process, and display
          that content for the purpose of operating the service, including
          displaying it to users you have chosen to share it with. Further
          detail on how User Content is shared with other users, including
          the current absence of per-habit privacy controls within the
          Friends feature, is set out in our{" "}
          <a href="/privacy" className="text-gold-bright hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </Section>

      <Section heading="6. Social features">
        <p>
          Reactions, encouragement notes, and nudges are intended to
          support, not pressure, other users. Nudges are rate-limited to
          prevent repeated or coordinated messaging. We reserve the right
          to remove social content, or to restrict a user&apos;s access to
          social features, where it is used to harass or pressure others.
        </p>
      </Section>

      <Section heading="7. Fees">
        <p>
          Habacus is currently provided free of charge during private beta.
          We may introduce paid features or a subscription tier in future.
          If we do, we will provide notice and obtain your agreement before
          any charge is applied, and will not withdraw functionality that
          was previously free without reasonable notice.
        </p>
      </Section>

      <Section heading="8. Intellectual property">
        <p>
          The Habacus name, logo, application design, and underlying
          software are owned by Ascension Labs and protected by applicable
          intellectual property laws. Nothing in these Terms grants you any
          right or license in respect of our trademarks or branding, other
          than as reasonably necessary to use the service as intended.
        </p>
      </Section>

      <Section heading="9. Third-party services">
        <p>
          Habacus relies on third-party service providers, including a
          specialised identity provider for account authentication and
          Apple&apos;s App Store for distribution. Your use of those
          services may be subject to their respective terms.
        </p>
      </Section>

      <Section heading="10. Disclaimers">
        <p>
          Habacus is a consistency and habit-tracking tool and does not
          constitute medical, psychological, or other professional advice.
          The service is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis, without warranties of any kind, whether
          express or implied, including as to uninterrupted, error-free, or
          continuous availability. This section does not affect any
          statutory rights that cannot lawfully be excluded.
        </p>
      </Section>

      <Section heading="11. Limitation of liability">
        <p>
          To the fullest extent permitted by law, Ascension Labs shall not
          be liable for any indirect, incidental, or consequential damages
          arising out of or relating to your use of Habacus. Nothing in
          these Terms limits or excludes liability that cannot lawfully be
          limited or excluded, including liability for death or personal
          injury caused by negligence, or for fraud.
        </p>
      </Section>

      <Section heading="12. Termination">
        <p>
          You may stop using Habacus and delete your account at any time.
          We may suspend or terminate your access to the service if you
          breach these Terms, and may discontinue the service, or any part
          of it, giving reasonable notice where practicable.
        </p>
      </Section>

      <Section heading="13. Governing law">
        <p>
          These Terms are governed by the laws of England and Wales,
          without regard to conflict-of-law principles. If you are a
          consumer resident in another jurisdiction, mandatory local
          consumer-protection laws applicable to you are unaffected.
        </p>
      </Section>

      <Section heading="14. Changes to these Terms">
        <p>
          We may amend these Terms from time to time. The &quot;last
          updated&quot; date above will be revised accordingly, and we
          will use reasonable efforts to notify you directly of any
          material change.
        </p>
      </Section>

      <Section heading="15. Contact">
        <p>
          Questions regarding these Terms may be directed to{" "}
          <a
            href="mailto:hello@habacus.app"
            className="text-gold-bright hover:underline"
          >
            hello@habacus.app
          </a>
          .
        </p>
      </Section>
    </LegalDoc>
  );
}
