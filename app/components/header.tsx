import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full p-4 z-10 bg-background border-primary flex items-center justify-between mx-auto rounded-2xl ">
      
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
          <ul className='flex items-center gap-12 text-sm uppercase font-bold'>
            <li>AncRE 1</li>
            <li>ANCRE 2</li>
            <li>ANCRE 3</li>
            <li>ANCRE 4</li>
            </ul>
        </nav>
        <Button>Commencer</Button>
     
    </header>
  );
};

export default Header;
