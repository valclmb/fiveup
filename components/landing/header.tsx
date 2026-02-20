import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
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
      <nav className="flex items-center justify-between gap-21">
        <Link href="/">
          <Image
            src="/logos/logo-white.svg"
            alt="logo"
            width={95}
            height={29}
          />
        </Link>
        <ul className="flex items-center gap-8 text-md text-muted-foreground">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-3">
        <Button variant="secondary">
          Sign in
        </Button>
        <Button variant="landing">
          Get more reviews
          <ChevronRight />
        </Button>
      </div>

    </header>
  );
};