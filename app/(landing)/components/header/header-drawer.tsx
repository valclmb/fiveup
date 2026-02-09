"use client"

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from 'react';
import { HeaderCta } from "./header-cta";
import { Nav } from './header-nav';

export const HeaderDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer direction='top' open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline" className="md:hidden cursor-pointer">
          <Menu />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="z-110 m-3 rounded-t-lg border-card bg-background/80 backdrop-blur-3xl after:bg-transparent! ">
        <DrawerHeader className="flex items-center justify-center pt-9 pb-2">
          <Image src="/logos/logo-white.svg" alt="Logo" width={80} height={10} />
        </DrawerHeader>

        <Nav key={isOpen ? 'open' : 'closed'} drawer className="md:hidden px-6 pt-18 pb-2" />

        <HeaderCta className='w-full flex items-center justify-center p-5 pt-2' />

      </DrawerContent>


    </Drawer>
  );
};
