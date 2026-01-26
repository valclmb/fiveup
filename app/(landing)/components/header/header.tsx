import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedHeaderWrapper } from '../animated-wrapper';
import { HeaderCta } from './header-cta';
import { HeaderDrawer } from './header-drawer';
import { Nav } from './header-nav';

const Header = async () => {
  return (
    <header className="sticky top-0 z-40 pt-1 max-w-7xl w-full mx-auto">
      <AnimatedHeaderWrapper
        className={cn(
          "origin-top border-[0.1px] m-1 border-black/40 p-4 bg-black/70 backdrop-blur-2xl flex items-center justify-between rounded-2xl",
          "transition-colors duration-300",
        )}
      >
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logos/logo-white.svg"
              alt="Logo"
              width={110}
              height={29}
              priority
              className='translate-y-0.5 translate-x-1'
            />
          </Link>
        </div>
        <Nav className='hidden md:flex' />
        <div className='flex items-center gap-2'>
          <HeaderCta className='hidden sm:flex' />
          <HeaderDrawer />
        </div>

      </AnimatedHeaderWrapper>
    </header>
  );
};

export default Header;