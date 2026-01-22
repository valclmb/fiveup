import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from "@/auth";

const Header = async () => {
  const session = await auth();

  return (
    <header className="w-full p-4 z-10 bg-background border-primary flex items-center justify-between mx-auto rounded-2xl">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={110}
            height={29}
            priority
          />
        </Link>
      </div>
      
      <nav>
        <ul className='flex items-center gap-12 text-sm uppercase font-bold text-foreground/70'>
          <li>Ancre 1</li>
          <li>Ancre 2</li>
          <li>Ancre 3</li>
          <li>Ancre 4</li>
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <Link href={session ? "/dashboard" : "/auth/signup"}>
          <Button>Commencer</Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;