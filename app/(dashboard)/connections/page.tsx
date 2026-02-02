"use client"
import ConnectFiveUp from "@/components/features/connections/connect-fiveup";
import ConnectGoogleBusiness from "@/components/features/connections/connect-google-business";
import ConnectMail from "@/components/features/connections/connect-mail";
import ShopifyIntegrationCard from "@/components/features/connections/connect-shopify";
import ConnectTrustpilot from "@/components/features/connections/connect-trustpilot";
import ConnectWhatsapp from "@/components/features/connections/connect-whatsapp";
import ConnectWix from "@/components/features/connections/connect-wix";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { useRef } from "react";


export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shopifyRef = useRef<HTMLDivElement>(null);
  const wixRef = useRef<HTMLDivElement>(null);
  const fiveUpRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);
  const googleBusinessRef = useRef<HTMLDivElement>(null);
  const trustpilotRef = useRef<HTMLDivElement>(null);

  return (
    <Card >
      <CardContent className="space-y-6">
        <div>
          <Typography variant="p">Your store</Typography>
          <Typography variant="description" className="text-muted-foreground">
            Connect to your Google Business, Trustpilot, verified reviews, Shopify and Wix accounts
          </Typography>
        </div>
        <div
          className="relative flex w-full flex-col items-center gap-24 overflow-hidden rounded-lg p-6"
          ref={containerRef}
        >

          {/* Ligne 1 : Shopify et Wix au même niveau */}
          <div className="flex w-full max-w-[640px] items-stretch justify-center gap-6">
            <div ref={shopifyRef} className="relative z-10 w-full max-w-[300px]">

              <ShopifyIntegrationCard />
            </div>
            <div ref={wixRef} className="relative z-10 w-full max-w-[300px]">
              <ConnectWix />
            </div>
          </div>
          <div ref={fiveUpRef} className="relative z-10 w-full max-w-[250px]">
            <ConnectFiveUp />
          </div>
          <div className="flex w-full  items justify-center gap-6">
            <div ref={whatsappRef} className="relative z-10 w-full max-w-[250px]">
              <ConnectWhatsapp />
            </div>
            <div ref={mailRef} className="relative z-10 w-full max-w-[250px]">
              <ConnectMail />
            </div>
          </div>
          <div className="flex w-full justify-center gap-6">
            <div ref={trustpilotRef} className="relative z-10 w-full max-w-[300px]">
              <ConnectTrustpilot />
            </div>
            <div ref={googleBusinessRef} className="relative z-10 w-full max-w-[300px]">
              <ConnectGoogleBusiness />
            </div>
          </div>
          <AnimatedBeam
            duration={30}
            staggerInterval={5}
            containerRef={containerRef}
            fromRef={shopifyRef}
            toRef={fiveUpRef}
            pathWidth={3}
          />
          <AnimatedBeam
            duration={30}
            staggerInterval={5}
            containerRef={containerRef}
            fromRef={wixRef}
            toRef={fiveUpRef}
            reverse
            disabled
            pathWidth={3}
          />
          <AnimatedBeam
            duration={30}
            delay={1}
            staggerInterval={5}
            containerRef={containerRef}
            fromRef={fiveUpRef}
            toRef={whatsappRef}
            reverse
            pathWidth={3}
          />
          <AnimatedBeam
            duration={30}
            delay={1}
            staggerInterval={5}
            containerRef={containerRef}
            fromRef={fiveUpRef}
            toRef={mailRef}
            disabled
            pathWidth={3}
          />
          <AnimatedBeam
            duration={30}
            delay={2.5}
            staggerInterval={5}
            containerRef={containerRef}
            fromRef={whatsappRef}
            toRef={googleBusinessRef}
            pathWidth={3}
          />
          <AnimatedBeam
            duration={30}
            delay={2.5}
            staggerInterval={5}
            containerRef={containerRef}
            fromRef={mailRef}
            toRef={googleBusinessRef}
            disabled
            pathWidth={3}
          />
          <AnimatedBeam
            duration={30}
            delay={2.5}
            staggerInterval={5}
            containerRef={containerRef}
            fromRef={whatsappRef}
            toRef={trustpilotRef}
            reverse
            disabled
            pathWidth={3}
          />
          <AnimatedBeam
            duration={30}
            delay={2.5}
            staggerInterval={5}
            containerRef={containerRef}
            fromRef={mailRef}
            toRef={trustpilotRef}
            reverse
            disabled
            pathWidth={3}

          />
        </div>
      </CardContent>
    </Card>
  )
}
