import Typography from "@/components/ui/typography";

function LegalNoticePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <header className="space-y-2">
        <Typography variant="h1">
          Legal Notice (FiveUp Review)
        </Typography>
        <Typography variant="p" affects="mutedDescription">
          Effective Date: 30 janvier 2026
        </Typography>
      </header>

      <section className="space-y-3">
        <Typography variant="h2">1. Website Publisher</Typography>
        <Typography variant="p">
          This website and the FiveUp Review platform (collectively, the &quot;Service&quot;)
          are published and operated by:
        </Typography>
        <Typography variant="p">Legal name: LH Solutions LLC</Typography>
        <Typography variant="p">Trading as: FiveUp Review</Typography>
        <Typography variant="p">Legal form: Limited Liability Company (LLC)</Typography>
        <Typography variant="p">License number: 2428237.01</Typography>
        <Typography variant="p">
          Registered address: Shams Business Center, Sharjah Media City Free Zone,
          Al Messaned, Sharjah, United Arab Emirates
        </Typography>
        <Typography variant="p">Free Zone Authority: Sharjah Media City (Shams)</Typography>
        <Typography variant="p">Director: Lucas Jacques Bernard Cotelle</Typography>
        <Typography variant="p">Contact email: info@fiveup-review.com</Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">2. Hosting</Typography>
        <Typography variant="p">
          The Service is hosted by third-party infrastructure providers including but not limited to:
        </Typography>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <Typography variant="p">
              Frontend hosting: Vercel Inc. — 340 Pine Street, Suite 701, San Francisco, CA 94104, USA (vercel.com)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Database: Neon, Inc. — cloud-hosted PostgreSQL service (neon.tech)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              File storage: Cloudflare, Inc. — R2 Object Storage (cloudflare.com)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Email delivery: Resend — email API provider (resend.com)
            </Typography>
          </li>
          <li>
            <Typography variant="p">
              Messaging: WhatsApp Business API &amp; SMS providers via authorized third-party aggregators
            </Typography>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">3. Intellectual Property</Typography>
        <Typography variant="p">
          All content available on this website and within the Service — including but not limited to text,
          graphics, logos, icons, images, design elements, software, and source code — is the exclusive
          property of LH Solutions LLC or its licensors, and is protected under applicable intellectual
          property laws.
        </Typography>
        <Typography variant="p">
          The FiveUp and FiveUp Review names, logos, and trademarks are the property of LH Solutions LLC.
          No license or right to use any trademark is granted by accessing this website.
        </Typography>
        <Typography variant="p">
          Unauthorized reproduction, distribution, modification, or use of any content from this website, in
          whole or in part, without prior written permission from LH Solutions LLC is strictly prohibited.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">4. Third-Party Services &amp; Integrations</Typography>
        <Typography variant="p">
          The Service integrates with third-party platforms including Shopify, WooCommerce, Wix, Google
          Business Profile, Trustpilot, WhatsApp Business, and others. These services are governed by their
          own terms, privacy policies, and conditions. LH Solutions LLC is not responsible for the availability,
          accuracy, or actions of any third-party service.
        </Typography>
        <Typography variant="p">
          Links or references to third-party websites on this platform do not constitute an endorsement or
          affiliation unless explicitly stated.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">5. Limitation of Liability</Typography>
        <Typography variant="p">
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. LH Solutions LLC makes no
          warranty, express or implied, regarding the accuracy, completeness, reliability, or suitability of
          the Service for any particular purpose.
        </Typography>
        <Typography variant="p">
          To the maximum extent permitted by applicable law, LH Solutions LLC and its directors, employees,
          and agents shall not be liable for any indirect, incidental, special, consequential, or punitive
          damages, including but not limited to loss of revenue, data, goodwill, or business opportunities,
          arising out of or in connection with the use of or inability to use the Service.
        </Typography>
        <Typography variant="p">
          Our total aggregate liability for any claim shall not exceed the amounts paid by you to FiveUp in
          the three (3) months preceding the event giving rise to the claim, or USD 100 if no payment has
          been made.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">6. Personal Data &amp; Privacy</Typography>
        <Typography variant="p">
          The collection and processing of personal data in connection with your use of the Service is
          governed by our Privacy Policy, which forms an integral part of these legal terms. By using the
          Service, you acknowledge and agree to the practices described therein.
        </Typography>
        <Typography variant="p">
          FiveUp operates as a SaaS platform. Merchants using FiveUp are responsible for ensuring they hold
          the appropriate rights and consents to use their customers&apos; contact data and to send
          communications via WhatsApp, SMS, or email in compliance with all applicable laws and platform
          policies.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">7. Cookies</Typography>
        <Typography variant="p">
          This website may use cookies and similar tracking technologies to improve the user experience,
          analyze traffic, and support certain features. By continuing to use this website, you consent to
          the use of cookies in accordance with our Privacy Policy.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">8. Governing Law &amp; Jurisdiction</Typography>
        <Typography variant="p">
          This Legal Notice and any disputes arising in connection with it shall be governed by and construed
          in accordance with the laws of the United Arab Emirates, and specifically the regulations of the
          Emirate of Sharjah and the Sharjah Media City Free Zone.
        </Typography>
        <Typography variant="p">
          Any dispute or claim arising out of or in connection with this Legal Notice shall be subject to the
          exclusive jurisdiction of the Sharjah Courts, United Arab Emirates.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">9. Updates to This Notice</Typography>
        <Typography variant="p">
          LH Solutions LLC reserves the right to update or modify this Legal Notice at any time. Changes
          will be posted on this page with an updated effective date. Continued use of the Service after
          any changes constitutes your acceptance of the revised Legal Notice.
        </Typography>
      </section>

      <section className="space-y-3">
        <Typography variant="h2">10. Contact</Typography>
        <Typography variant="p">
          For any questions regarding this Legal Notice, please contact us at:
        </Typography>
        <Typography variant="p">
          Company: LH Solutions LLC (FiveUp Review)
        </Typography>
        <Typography variant="p">
          Address: Shams Business Center, Sharjah Media City Free Zone,
          Al Messaned, Sharjah, UAE
        </Typography>
        <Typography variant="p">
          Email: info@fiveup-review.com
        </Typography>
      </section>
    </div>
  );
}

export default LegalNoticePage;