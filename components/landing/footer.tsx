import Image from "next/image";
import Link from "next/link";
import Typography from "../ui/typography";

const Footer = () => {

  return (

    <footer className="relative z-20  w-full py-10  mt-20 ">
      <div >
        <section className="flex  flex-wrap sm:flex-row justify-between gap-10 sm:gap-5 pt-10 ">
          <div className="flex flex-col justify-between ">
            <div>
              <Image src="/logos/logo-white-baseline.svg" alt="logo" width={158} height={40} className="mb-4" />
              <Link href="mailto:contact@fiveup.com" className=" hover:underline text-primary" >contact@fiveup.com</Link>
            </div>
            <Typography variant="p" >
              © {new Date().getFullYear()} FiveUp | All rights reserved.
            </Typography>
          </div>
          <ul className="space-y-6  text-muted-foreground min-w-32">
            <li className="mb-4 text-foreground text-lg">
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
            <li >
              <Link href="/faqs">FAQs</Link>
            </li>
            <li >          <Link href="/auth/signin">Sign up for free</Link>
            </li>
            <li >
              <Link href="/book-a-demo">Book a demo</Link>
            </li>
          </ul>
          <ul className="space-y-6  text-muted-foreground min-w-32">
            <li className="mb-4 text-foreground text-lg ">
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
            <li >
              <Link className="opacity-40" href="">Coming soon - Blog</Link>
            </li>
          </ul>
          <ul className="space-y-6  text-muted-foreground min-w-32">
            <li className="mb-4 text-foreground text-lg">
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

      </div>
    </footer>
    // </AnimatedFadeUp >
  );
};

export default Footer;