import Typography from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import { AnimatedFadeUp } from "./animated-wrapper";

const Footer = () => {

  return (
    <AnimatedFadeUp className="w-full">
      <footer className="bg-linear-to-t from-background to-black w-full py-10 border-t  mt-20 ">
        <div className="max-w-7xl mx-auto px-8">


          <section className="flex flex-col sm:flex-row justify-between pt-10 ">
            <div className="max-w-48">
              <Image src="/logos/logo-white-baseline.svg" alt="logo" width={200} height={40} className="mb-6" />
              <Typography variant="description" className="leading-5">Turn every customer into a 5-star review</Typography>
            </div>
            <ul className="space-y-2">
              <li className="mb-6">
                <Link href="/" className="font-bold" >Useful links</Link>
              </li>
              <li>
                <Link href="/">Sales terms and conditions</Link>
              </li>
              <li>
                <Link href="/">Privacy policy</Link>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="mb-6">
                <Link href="/" className="font-bold">Contact us</Link>
              </li>
              <li >
                <Link href="mailto:contact@fiveup.com" className="hover:underline text-white" >contact@fiveup.com</Link>
              </li>
              <li>
                <Link href="tel:+33664292232" className="hover:underline text-white" >+33 6 64 29 22 32</Link>
              </li>
            </ul>

          </section>
          <Typography variant="p" className="text-muted-foreground mt-7">
            fiveup 2026 - All rights reserved
          </Typography>
        </div>
      </footer>
    </AnimatedFadeUp>
  );
};

export default Footer;