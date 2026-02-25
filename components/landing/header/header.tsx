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
    label: "Book a demo ",
    href: "/book-a-demo",
  },
]

export const LandingHeader = () => {
  return (
    <header className="sticky bg-background/80 backdrop-blur-lg border-[0.5px] border-background  rounded-3xl top-2 z-100 flex items-center justify-between w-full max-w-5xl mx-auto p-6 pl-9">
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