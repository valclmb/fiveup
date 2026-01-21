import Typography from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {

  return (
    <footer className="bg-linear-to-t from-background to-black w-full py-10  border-t mt-20 ">
      <div className="max-w-7xl mx-auto px-8">


        <section className="flex justify-between pt-10 ">
          <div className="max-w-48">
            <Image src="/logo.svg" alt="logo" width={115} height={40} className="mb-6" />
            <Typography variant="description" className="leading-5">Transformez chaque client en avis 5 étoiles</Typography>
          </div>
          <ul className="space-y-2">
            <li className="mb-6">
              <Link href="/" className="font-bold" >Lien utiles</Link>
            </li>
            <li>
              <Link href="/">Condition générales de ventes</Link>
            </li>
            <li>
              <Link href="/">Politique de confidentialité</Link>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="mb-6">
              <Link href="/" className="font-bold">Contact</Link>
            </li>
            <li >
              <Link href="mailto:contact@fiveup.com" className="hover:underline" >contact@fiveup.com</Link>
            </li>
            <li>
              <Link href="tel:+33664292232" className="hover:underline" >+33 6 64 29 22 32</Link>
            </li>
          </ul>

        </section>
        <Typography variant="p" className="text-muted-foreground mt-7">
          fiveup 2026 - Tous droits réservés
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;