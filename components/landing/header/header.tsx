import Image from "next/image";
import Link from "next/link";
import { HeaderCta } from "./header-cta";
import { HeaderDrawer } from "./header-drawer";
import { HeaderNav } from "./header-nav";

export const LANDING_NAV = [
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Affiliate",
    href: "/affiliate",
  },
  {
    label: "FAQs",
    href: "/faq",
  },
]

export const LandingHeader = () => {
  return (
    <header className="flex items-center justify-between w-full max-w-5xl mx-auto p-6 pl-9">
      <div className="flex items-center justify-between gap-21">
        <Link href="/">
          <Image
            src="/logos/logo-white.svg"
            alt="logo"
            width={95}
            height={29}
          />
        </Link>
        <HeaderNav className="hidden lg:flex" />
      </div>

      <div className="flex items-center gap-3">
        <HeaderCta />
        <HeaderDrawer />
      </div>

    </header>
  );
};