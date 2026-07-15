import type { Metadata } from "next";
import { LegalDoc, Section } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy — Habacus",
  description: "How Habacus collects, uses, and shares your information.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="15 July 2026"
      intro="This policy explains what Habacus collects, why, and who it's shared with — written to match what the app actually does today, not an idealised version of it."
    >
      <Section heading="Who we are">
        <p>
          Habacus is made by Ascension Labs (&quot;Ascension Labs,&quot;
          &quot;we,&quot; &quot;us&quot;). This policy applies to the Habacus
          app and this website. If something here ever stops matching what
          the app actually does, treat the app&apos;s behaviour as a bug
          report against this document, not the other way round — and please
          tell us.
        </p>
      </Section>

      <Section heading="Information we collect">
        <p>
          <strong className="text-foreground">Account information.</strong>{" "}
          Habacus uses Auth0 to handle sign-up and login. Depending on how
          you sign in, this means we hold your name, email address, and an
          authentication identifier issued by Auth0. We don&apos;t see or
          store your password — Auth0 does.
        </p>
        <p>
          <strong className="text-foreground">Habit and log data.</strong>{" "}
          The habits you create (names, icons) and the days you mark as done
          are synced to our backend so your data is available across
          sessions and devices, not only stored on your phone.
        </p>
        <p>
          <strong className="text-foreground">Profile information.</strong>{" "}
          Your username, display name, and any bio you add.
        </p>
        <p>
          <strong className="text-foreground">Friends and social activity.</strong>{" "}
          Friend requests, accepted connections, reactions, encouragement
          notes, and nudges you send or receive through the Friends feed.
        </p>
        <p>
          <strong className="text-foreground">Contacts (optional).</strong>{" "}
          If you choose to use &quot;find friends from contacts,&quot; the
          app requests permission to read your device contacts so it can
          check which of them already use Habacus. This only happens if you
          trigger it, and it&apos;s used solely to suggest matches — we don&apos;t
          build a permanent copy of your address book on our servers.
        </p>
        <p>
          <strong className="text-foreground">App preferences.</strong>{" "}
          Theme, accent colour, frame material, text size, and haptics
          settings, so your Habacus looks and feels the way you left it.
        </p>
        <p>
          <strong className="text-foreground">Standard technical data.</strong>{" "}
          Basic diagnostic and device information (like crash logs or app
          version) that most apps collect to keep things running.
        </p>
      </Section>

      <Section heading="How we use this information">
        <p>
          To run the core product — sliding a bead, keeping your history,
          syncing it across devices, and showing your rolling consistency.
          To power the Friends feed and nudges. To respond when you contact
          us. To fix bugs and improve the app. We do not use your data to
          serve ads, and we do not sell your personal information to third
          parties, brokers, or advertisers.
        </p>
      </Section>

      <Section heading="What your friends can see (please read this one)">
        <p>
          Habacus&apos;s Friends feature shares your completed habits with
          people you&apos;ve accepted as friends. Right now, that sharing is{" "}
          <strong className="text-foreground">
            all-or-nothing: once someone is an accepted friend, they can see
            all of your habits and whether you&apos;ve completed them today
          </strong>
          . Per-habit privacy toggles and per-friend targeting (so you could
          share &quot;gym&quot; with everyone but keep &quot;therapy&quot;
          private, for instance) are on our roadmap but are{" "}
          <strong className="text-foreground">not built yet</strong>. Until
          they are, please only add habits you&apos;re comfortable with any
          accepted friend seeing. We&apos;d rather tell you this plainly now
          than have it be a surprise later.
        </p>
      </Section>

      <Section heading="Who we share information with">
        <p>
          We share data with the service providers that make Habacus work:
          Auth0 (authentication), our application hosting/backend provider,
          and standard infrastructure vendors (e.g. crash reporting, error
          monitoring). These providers process data on our behalf and
          under contract — they don&apos;t get to use it for their own
          purposes. We may also disclose information if required by law, to
          protect the rights and safety of our users, or in connection with
          a merger, acquisition, or sale of assets (in which case we&apos;d
          tell you).
        </p>
      </Section>

      <Section heading="Data retention and deletion">
        <p>
          We keep your account and habit data for as long as your account is
          active. You can delete individual habits at any time in the app.
          To delete your account entirely, use the &quot;reset all
          data&quot; option in Settings or email us at{" "}
          <a
            href="mailto:hello@habacus.app"
            className="text-gold-bright hover:underline"
          >
            hello@habacus.app
          </a>{" "}
          and we&apos;ll remove your account and associated data from our
          systems, subject to any legal retention obligations.
        </p>
      </Section>

      <Section heading="Children's privacy">
        <p>
          Habacus is not directed at children under 13 (or the minimum age
          required in your country to consent to data processing without
          parental approval), and we don&apos;t knowingly collect data from
          children under that age. If you believe a child has created an
          account, contact us and we&apos;ll remove it.
        </p>
      </Section>

      <Section heading="International data transfers">
        <p>
          Ascension Labs and its service providers may process your
          information in countries other than the one you live in. Where
          that happens, we rely on the safeguards required by applicable
          law (such as the UK and EU standard contractual clauses) to
          protect your data in transit and at rest.
        </p>
      </Section>

      <Section heading="Security">
        <p>
          We use industry-standard measures — encrypted connections,
          credential storage via your device&apos;s secure keychain, and
          access controls on our backend — to protect your data. No system
          is perfectly secure, and we can&apos;t guarantee absolute security,
          but we treat this seriously and will tell you if something goes
          wrong.
        </p>
      </Section>

      <Section heading="Your rights">
        <p>
          Depending on where you live (including under the UK GDPR and EU
          GDPR), you may have the right to access, correct, delete, or
          export your personal data, to object to or restrict certain
          processing, and to withdraw consent where processing relies on
          it. To exercise any of these, email{" "}
          <a
            href="mailto:hello@habacus.app"
            className="text-gold-bright hover:underline"
          >
            hello@habacus.app
          </a>
          . If you&apos;re in the UK or EU and unhappy with our response, you
          also have the right to lodge a complaint with your local data
          protection authority (the ICO, if you&apos;re in the UK).
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          If we change what we collect or how we use it, we&apos;ll update
          this page and adjust the &quot;last updated&quot; date above. For
          material changes, we&apos;ll try to give you a more direct heads
          up in the app.
        </p>
      </Section>

      <Section heading="Contact us">
        <p>
          Questions, concerns, or a data request? Reach us at{" "}
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
        This page is a plain-language draft describing our current data
        practices, written for a beta-stage product — it isn&apos;t legal
        advice, and we&apos;d encourage running it past a lawyer before
        relying on it for an App Store submission or in a jurisdiction with
        specific regulatory requirements.
      </p>
    </LegalDoc>
  );
}
