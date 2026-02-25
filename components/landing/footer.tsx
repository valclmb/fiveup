import Image from "next/image";
import Link from "next/link";
import Typography from "../ui/typography";

const Footer = () => {

  return (

    <footer className="relative z-20  w-full py-10 px-4 md:px-12">
      <div >
        <section className="relative grid grid-cols-1 justify-between md:grid-cols-3 lg:grid-cols-4 gap-15 md:gap-10 pt-10 ">
          <div className="col-span-1 md:col-span-3 lg:col-span-1 flex flex-col justify-between ">
            <div className="flex flex-col justify-between items-start md:flex-row lg:flex-col">
              <Image src="/logos/logo-white-baseline.svg" alt="logo" width={158} height={40} className="mb-4" />
              <Link href="mailto:contact@fiveup.com" className=" hover:underline text-primary" >contact@fiveup.com</Link>
            </div>
            <Typography variant="p" className="hidden lg:block " >
              © {new Date().getFullYear()} FiveUp | All rights reserved.
            </Typography>
          </div>
          <ul className="col-span-1 md:col-span-1 space-y-6  text-muted-foreground min-w-32">
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
          <ul className="col-span-1 md:col-span-1 space-y-6  text-muted-foreground min-w-32">
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
          <ul className="col-span-1 md:col-span-1  space-y-6  text-muted-foreground min-w-32">
            <li className="mb-4 text-foreground text-lg">
              Informations
            </li>
            <li >
              <Link href="/terms">Terms</Link>
            </li>
            <li >
              <Link href="/privacy-policy">Privacy</Link>
            </li>
            <li >
              <Link href="/legal-notice">Legal Notice</Link>
            </li>

          </ul>
          <Typography variant="p" className="mt-4 col-span-1 md:col-span-3 lg:hidden" >
            © {new Date().getFullYear()} FiveUp | All rights reserved.
          </Typography>
        </section>

      </div>
    </footer>

  );
};

export default Footer;