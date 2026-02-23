'use client'
import { ContentPageTemplate } from "@/components/landing/content-page-template";
import { buttonVariants } from "@/components/ui/button";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { Slider } from "@/components/ui/slider";
import Typography from "@/components/ui/typography";
import { useState } from "react";

export default function AffiliatePage() {
  const [value, setValue] = useState([50]);
  const price = 100;
  const commission = price * 0.3 * value[0];
  return (
    <ContentPageTemplate
      badge="Affiliate"
      title={
        <div className="flex flex-col items-center gap-4">
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold">
            Become an affiliate
          </Typography>
          <LayoutTextFlip
            words={["Get paid for referring customers.", "Earn money for every sale.", "Start earning today."]}
            interval={3500}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          />
          <a
            href="https://fiveup.affonso.io"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "landing", className: "flex justify-center mt-4" })}

          >
            Become an affiliate
          </a>
        </div>
      }

      description="Become an affiliate and earn 30% commission for every sale you refer."
    >

      <div className="flex items-center justify-between w-full  gap-10">
        <div className="relative w-full">
          <Slider id="slider" onValueChange={setValue} value={value} max={1000} />
          <div
            className="-translate-x-1/2 -top-14 w-max absolute rounded-lg bg-background border border-border px-2 py-1 text-foreground text-sm"
            style={{ left: `${value[0] / 10}%` }}
          >
            {value[0]} referrals
          </div>

        </div>
        <Typography variant="p" className="text-4xl text-primary text-center font-semibold min-w-42">
          {commission.toLocaleString("fr-FR")} $
          <div className="text-sm font-normal text-muted-foreground ">
            per month
          </div>
        </Typography>
      </div>
    </ContentPageTemplate >
  );
}