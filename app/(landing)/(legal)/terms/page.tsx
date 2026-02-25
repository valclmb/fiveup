import Typography from "@/components/ui/typography";

function TermsPage() {
  return (
    <div className=" max-w-7xl mx-auto space-y-8 p-4">
      <header className="space-y-2">
        <Typography variant="h1">
          Terms and Conditions (FiveUp Review)
        </Typography>
        <Typography variant="p" affects="mutedDescription">
          Effective Date: 30 janvier 2026
        </Typography>
      </header>

      <section className="space-y-4">
        <Typography variant="p">
          These Terms and Conditions "Terms" govern your access to and use of the
          website and services provided by FiveUp Review ("FiveUp", "we", "us",
          "our"), operated by LH Solutions LLC (the "Company"). By accessing or using our
          website and/or services (collectively, the "Services"), you agree to be bound by
          these Terms. If you do not agree, please do not use the Services.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">1) Use of the Services</Typography>

        <Typography variant="h3">1.1 Eligibility</Typography>
        <Typography variant="p">
          You must be at least 18 years old to use the Services. By using the Services, you
          confirm that you meet this requirement.
        </Typography>

        <Typography variant="h3">1.2 Accounts</Typography>
        <Typography variant="p">
          Some features may require creating an account. You are responsible for keeping your
          login credentials confidential and for all activity that occurs under your account.
          You must provide accurate information and keep it up to date.
        </Typography>

        <Typography variant="h3">1.3 Acceptable use</Typography>
        <Typography variant="p">
          You agree not to use the Services for any unlawful, harmful, or abusive activity. You
          may not:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              a) violate any applicable laws or regulations;
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              b) infringe the rights of others (including intellectual property and privacy
              rights);
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              c) attempt to gain unauthorized access to our systems or other users'
              accounts;
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              d) distribute malware, spam, or engage in disruptive activity;
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              e) use the Services to misrepresent identity or send messages without proper
              authorization.
            </Typography>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">2) Privacy</Typography>
        <Typography variant="p">
          Your use of the Services is subject to our Privacy Policy, which explains how we
          collect and use data. By using the Services, you agree to our Privacy Policy.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">
          3) FiveUp as a SaaS platform (merchants &amp; end-customers)
        </Typography>
        <Typography variant="p">
          FiveUp is a software platform used by businesses (e.g., Shopify brands and local
          businesses) to request and manage customer feedback and reviews.
        </Typography>
        <Typography variant="p">
          Merchants are responsible for ensuring they have the right to use customer contact
          data and to send communications (e.g., WhatsApp/email/SMS) under applicable law and
          platform rules.
        </Typography>
        <Typography variant="p">
          When an end-customer receives a feedback request sent through FiveUp, it is generally
          sent on behalf of the merchant using the merchant&apos;s configuration.
        </Typography>
        <Typography variant="p">
          We may provide tools and templates to help merchants organize feedback and follow up,
          but merchants remain responsible for their own compliance obligations and customer
          communications.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">4) Third-party services and integrations</Typography>
        <Typography variant="p">
          The Services may integrate with third-party platforms (for example Shopify, Trustpilot,
          Google Business Profile, WhatsApp providers, email/SMS providers). Your use of those
          services is subject to their own terms and policies. We are not responsible for
          third-party services, their availability, or their actions.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">5) Intellectual property</Typography>

        <Typography variant="h3">5.1 Ownership</Typography>
        <Typography variant="p">
          All content and materials on the Services (including text, designs, logos, software,
          and visual assets) are owned by FiveUp or its licensors and are protected by
          intellectual property laws.
        </Typography>

        <Typography variant="h3">5.2 License to use</Typography>
        <Typography variant="p">
          We grant you a limited, non-exclusive, non-transferable, revocable license to access
          and use the Services for your internal business purposes, in accordance with these
          Terms. You may not copy, modify, distribute, sell, lease, reverse engineer, or create
          derivative works from the Services without our prior written consent.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">6) Disclaimer of warranties</Typography>
        <Typography variant="p">
          The Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the maximum
          extent permitted by law, we disclaim all warranties, express or implied, including
          fitness for a particular purpose, merchantability, and non-infringement. We do not
          guarantee that the Services will be uninterrupted, error-free, or that results
          (including review volume, ratings, or business outcomes) will be achieved.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">7) Limitation of liability</Typography>
        <Typography variant="p">
          To the maximum extent permitted by law, FiveUp and its affiliates, officers,
          employees, and agents will not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of profits, revenue, data, or
          goodwill.
        </Typography>
        <Typography variant="p">
          Our total liability for any claim arising out of or related to the Services will not
          exceed the amount paid by you to FiveUp in the three (3) months preceding the event
          giving rise to the claim (or USD 100 if you have not paid anything).
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">8) Suspension and termination</Typography>
        <Typography variant="p">
          We may suspend or terminate your access to the Services at any time if you violate
          these Terms, your use creates risk or legal exposure for us or others, if required by
          law, or if necessary for security or operational reasons. You may stop using the
          Services at any time.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">9) Changes to the Services or Terms</Typography>
        <Typography variant="p">
          We may update the Services and these Terms from time to time. If we make material
          changes, we will post the updated Terms on our website with a new effective date.
          Continued use of the Services after changes become effective means you accept the
          updated Terms.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">10) Governing law</Typography>
        <Typography variant="p">
          These Terms are governed by and construed in accordance with the laws of the United
          Arab Emirates. If needed, we may specify a more precise venue/jurisdiction (for
          example, Sharjah courts) depending on our needs.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">11) Contact</Typography>
        <Typography variant="p">
          If you have any questions about these Terms, contact us at:
        </Typography>
        <Typography variant="p">FiveUp Review (LH Solutions LLC)</Typography>
        <Typography variant="p">Email: info@fiveup-review.com</Typography>
      </section>
    </div>
  );
}

export default TermsPage;