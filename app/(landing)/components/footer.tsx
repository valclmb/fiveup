import Typography from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import { AnimatedFadeUp } from "./animated-wrapper";

const Footer = () => {

  return (
    <AnimatedFadeUp className="w-full">
      <footer className="bg-card w-full py-10 border-t  mt-20 ">
        <div className="max-w-7xl mx-auto px-8">


          <section className="flex  flex-wrap sm:flex-row justify-between gap-10 sm:gap-5 pt-10 ">
            <div >
              <Image src="/logos/logo-white-baseline.svg" alt="logo" width={200} height={40} className="mb-4" />
              <Link href="mailto:contact@fiveup.com" className="hover:underline text-white" >contact@fiveup.com</Link>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground min-w-32">
              <li className="mb-4 text-foreground">
                Company
              </li>
              <li >
                <Link href="#features">Features</Link>
              </li>
              <li >
                <Link href="/pricing">Pricing</Link>
              </li>
              <li >
                <Link href="/affiliate">Affiliate</Link>
              </li>
              <li >          <Link href="/auth/signin">Sign up for free</Link>
              </li>
              <li >
                <Link href="/book-a-demo">Book a demo</Link>
              </li>
              <li className=" opacity-40">
                <Link href="#">Blog - Coming soon</Link>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-muted-foreground min-w-32">
              <li className="mb-4 text-foreground ">
                Uses cases
              </li>
              <li >
                <Link className="opacity-40" href="">Coming soon - For dropshippers</Link>
              </li>
              <li >
                <Link className="opacity-40" href="">Coming soon - For Brands</Link>
              </li>
              <li >
                <Link className="opacity-40" href="">Coming soon - For Agencies</Link>
              </li>
              <li >
                <Link className="opacity-40" href="">Coming soon - For Physical businesses</Link>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-muted-foreground min-w-32">
              <li className="mb-4 text-foreground">
                Informations
              </li>
              <li >
                <Link href="/terms-of-use">Terms</Link>
              </li>
              <li >
                <Link href="/privacy-policy">Privacy</Link>
              </li>

            </ul>
          </section>
          <Typography variant="p" className="text-muted-foreground text-sm mt-7">
            FiveUp 2026 | All rights reserved
          </Typography>
        </div>
      </footer>
    </AnimatedFadeUp >
  );
};

export default Footer;