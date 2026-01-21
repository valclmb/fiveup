"use client"

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { motion } from "motion/react";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Nav = ({ className, linkClassName }: { className?: string, linkClassName?: string }) => {


  const links = [
    {
      label: 'AncRE 1',
      href: '/ancre-1'
    },
    {
      label: 'ANCRE 2',
      href: '/ancre-2'
    },
    {
      label: 'ANCRE 3',
      href: '/ancre-3'
    },
    {
      label: 'ANCRE 4',
      href: '/ancre-4'
    }
  ]
  return (
    <nav >
      <ul className={cn('flex  md:flex-row items-center gap-4  text-xs md:text-sm uppercase font-bold ', className)}>
        {links.map((link) => (
          <li key={link.href} className={cn('px-3 py-1 rounded-md hover:cursor-pointer hover:text-primary transition-colors hover:bg-tertiary', linkClassName)}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const handleToggle = () => {
    setIsOpen(current => !current);
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  }

  useEffect(() => {
    const threshold = 8; // ~ top-2
    const onScroll = () => setIsSticky(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full origin-top border-[0.1px] border-black/40 p-4 bg-black/70 backdrop-blur-2xl flex items-center justify-between mx-auto rounded-2xl",
        "transition-colors duration-300",
        // isSticky ? "bg-black/70" : "bg-black"
      )}
      initial={false}
      animate={{ y: isSticky ? 10 : 0, scale: isSticky ? 0.98 : 1 }}
      transition={{
        y: { type: "spring", stiffness: 520, damping: 42, mass: 0.7 },
        scale: { type: "spring", stiffness: 320, damping: 26, mass: 0.5 },
      }}
      style={{ willChange: "transform" }}
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
        <Button >Commencer</Button>

        <Drawer direction='top' open={isOpen} onOpenChange={handleOpenChange}>
          <DrawerClose>
            <Button size="icon" variant="outline" className="md:hidden cursor-pointer" onClick={handleToggle}><Menu /></Button>
          </DrawerClose>


          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className='text-2xl font-bold text-primary pt-2'>Menu</DrawerTitle>

            </DrawerHeader>
            <div className='pt-2 pb-8'>
              <Nav className='flex flex-col md:hidden gap-2' linkClassName="w-11/12 mx-auto text-center py-3 " />
            </div>
          </DrawerContent>
        </Drawer>
      </div>



    </motion.header >
  );
};

export default Header;
