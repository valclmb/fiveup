import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedHeaderWrapper } from './animated-wrapper';
import { HeaderDrawer } from './header-drawer';
import { Nav } from './header-nav';
import { auth } from "@/auth";

const Header = async () => {
 const session = await auth();

  return (
    <header className="sticky top-0 z-50 max-w-6xl w-full mx-auto">
      <AnimatedHeaderWrapper
        className={cn(
          "origin-top border-[0.1px] m-1 border-black/40 p-4 bg-black/70 backdrop-blur-2xl flex items-center justify-between rounded-2xl",
          "transition-colors duration-300",
        )}
      >
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={110}
              height={29}
              priority
              className='translate-y-0.5 translate-x-1'
            />
          </Link>
        </div>
        <Nav className='hidden md:flex' />
        <div className='flex items-center gap-2 md:gap-0'>
         <Link href={session ? "/dashboard" : "/auth/signup"}>
          <Button>Commencer</Button>
        </Link>
          <HeaderDrawer />
        </div>
      </AnimatedHeaderWrapper>
    </header>
  );
};

export default Header;