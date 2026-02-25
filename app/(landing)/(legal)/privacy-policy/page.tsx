import Typography from "@/components/ui/typography";

function PrivacyPolicyPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <header className="space-y-2">
        <Typography variant="h1">
          Privacy Policy (FiveUp Review)
        </Typography>
        <Typography variant="p" affects="mutedDescription">
          Effective Date: 30 janvier 2026
        </Typography>
      </header>

      <section className="space-y-3">
        <Typography variant="p">
          This Privacy Policy (&quot;Policy&quot;) explains how FiveUp Review (&quot;FiveUp&quot;, &quot;we&quot;, &quot;us&quot;,
          &quot;our&quot;) collects, uses, shares, and protects personal data when you visit our website
          and/or use our services (the &quot;Services&quot;), including our waitlist and beta program.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">1) Who we are (Data Controller)</Typography>
        <Typography variant="p">
          FiveUp Review is operated by:
        </Typography>
        <Typography variant="p">LH Solutions LLC</Typography>
        <Typography variant="p">Sharjah, UAE</Typography>
        <Typography variant="p">
          Registered Address: Shams Business Center, Al Messaned, Free Zone, Sharjah Media City,
          Sharjah, United Arab Emirates
        </Typography>
        <Typography variant="p">Contact number: +33 6 72 22 14 42</Typography>
        <Typography variant="p">Contact (privacy): info@fiveup-review.com</Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">
          2) Scope: website visitors, merchants, and end-customers
        </Typography>
        <Typography variant="p">
          Our Services are used by businesses (e-commerce brands and local businesses) to
          request and manage customer feedback and reviews.
        </Typography>
        <Typography variant="p">
          Depending on the context, data roles may differ:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Website / waitlist: FiveUp is generally the data controller for the information you
              submit directly to us.
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Merchant use of FiveUp: when a merchant connects their store and uses FiveUp to
              contact their customers, the merchant is typically the data controller for their
              customer data, and FiveUp acts as a data processor/service provider on the
              merchant&apos;s instructions.
            </Typography>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">3) Data we collect</Typography>

        <Typography variant="h3">
          A) Data you provide (Website / Waitlist / Sales)
        </Typography>
        <Typography variant="p">
          This may include:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Name, email, company name, role
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Business information (e.g., estimated order volume, channels you want to use)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Messages you send us (forms, support, email)
            </Typography>
          </li>
        </ul>

        <Typography variant="h3">
          B) Data we collect automatically (Website)
        </Typography>
        <Typography variant="p">
          We may collect certain technical data automatically when you visit our website, such
          as:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Device and log data (IP address, browser type, pages visited, timestamps)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Cookies and similar trackers (see Section 10)
            </Typography>
          </li>
        </ul>

        <Typography variant="h3">
          C) Data processed when merchants use FiveUp (Customer feedback flows)
        </Typography>
        <Typography variant="p">
          If you are a customer of a brand using FiveUp, we may process:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Contact details (e.g., phone number and/or email)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Order-related information (e.g., order ID, purchase date, product info depending on
              merchant settings)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Feedback data (rating, written feedback, and messages exchanged with the merchant)
            </Typography>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">4) How we use personal data</Typography>
        <Typography variant="p">
          We use personal data to:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Provide and operate the Services (including the waitlist and beta access)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Send product updates, onboarding messages, and operational communications
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Enable merchants to request feedback after an order, collect responses, and manage
              follow-up
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Maintain security, prevent fraud/abuse, and troubleshoot issues
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Improve our product, user experience, and performance (analytics and product insights)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Comply with legal obligations
            </Typography>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">5) Legal bases (when applicable)</Typography>
        <Typography variant="p">
          Where the GDPR or similar laws apply, we rely on:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Contract (to provide the Services to merchants or respond to requests)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Legitimate interests (security, service improvement, fraud prevention)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Consent (for certain cookies/marketing communications where required)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Legal obligation (compliance requests)
            </Typography>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">6) WhatsApp, email, and messaging</Typography>
        <Typography variant="p">
          FiveUp supports review requests through channels such as WhatsApp (key channel), and
          optionally email/SMS depending on merchant configuration.
        </Typography>
        <Typography variant="p">
          If you receive a message from a merchant via FiveUp, it is generally sent on behalf of
          the merchant.
        </Typography>
        <Typography variant="p">
          The message may include a link to a merchant-branded, customizable feedback page.
          Based on the rating submitted, the experience may present options such as leaving
          private feedback to the merchant or accessing a public review platform. The goal is to
          organize feedback and help merchants respond quickly, while making it easier for
          customers to share experiences publicly if they choose.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">7) Sharing of personal data</Typography>
        <Typography variant="p">
          We may share data with:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Service providers (hosting, databases, analytics, customer support tools,
              communications providers) that help us run FiveUp
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Integrations connected by merchants (e.g., e-commerce platform, public review
              platforms, business listing platforms) when the merchant enables them
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Legal authorities if required by law or to protect rights, safety, and security
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Business transfers (e.g., merger/acquisition), where permitted by law
            </Typography>
          </li>
        </ul>
        <Typography variant="p">
          We do not sell personal data.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">8) International transfers</Typography>
        <Typography variant="p">
          Our service providers and integrations may process data in countries outside your
          country of residence (including the EU/UK/US or other regions). Where required, we use
          appropriate safeguards (such as contractual protections) to support lawful transfers.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">9) Data retention</Typography>
        <Typography variant="p">
          We keep personal data only as long as necessary for:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              providing the Services,
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              maintaining legitimate business records,
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              complying with legal requirements,
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              resolving disputes and enforcing agreements.
            </Typography>
          </li>
        </ul>
        <Typography variant="p">
          Retention periods vary depending on data type and merchant configuration. Merchants
          can typically control retention of customer feedback data within their account
          settings, subject to applicable law.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">10) Cookies and tracking</Typography>
        <Typography variant="p">
          We use cookies and similar technologies for:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Essential functionality (security, page navigation)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Analytics (understanding traffic and product usage)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Preferences (saving settings)
            </Typography>
          </li>
        </ul>
        <Typography variant="p">
          You can manage cookies through your browser settings. Where required, we provide a
          cookie banner to manage consent.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">11) Security</Typography>
        <Typography variant="p">
          We implement reasonable technical and organizational measures to protect personal
          data against unauthorized access, alteration, disclosure, or destruction. No system is
          100% secure, but we work to maintain strong safeguards.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">12) Your rights</Typography>
        <Typography variant="p">
          Depending on your location, you may have rights such as:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Access, correction, deletion
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Objection or restriction of processing
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Data portability
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Withdrawal of consent (where applicable)
            </Typography>
          </li>
        </ul>
        <Typography variant="p">
          To exercise your rights, contact: +33 6 72 22 14 42. If you are an end-customer of a
          merchant using FiveUp, requests may be routed to the merchant (as data controller)
          where appropriate.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">13) Children&apos;s privacy</Typography>
        <Typography variant="p">
          FiveUp is not intended for children under 18. We do not knowingly collect personal
          data from children.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">14) Changes to this Policy</Typography>
        <Typography variant="p">
          We may update this Policy from time to time. The updated version will be posted on our
          website with a new effective date.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">15) Contact</Typography>
        <Typography variant="p">
          For privacy questions or requests: info@fiveup-review.com
        </Typography>
        <Typography variant="p">LH Solutions LLC</Typography>
        <Typography variant="p">
          Address: Shams Business Center, Al Messaned, Free Zone, Sharjah Media City, Sharjah,
          UAE
        </Typography>
        <Typography variant="p">Email: info@fiveup-review.com</Typography>
        <Typography variant="p">Phone: +33 6 72 22 14 42</Typography>
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;
