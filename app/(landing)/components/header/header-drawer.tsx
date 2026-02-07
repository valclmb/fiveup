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

      <DrawerContent className="z-110 m-2 rounded-t-2xl border-card bg-background/80 backdrop-blur-3xl after:bg-transparent! ">
        <DrawerHeader className="flex items-center justify-center pt-9">
          <Image src="/logos/logo-white.svg" alt="Logo" width={80} height={10} />
        </DrawerHeader>

        <Nav className='flex flex-col md:hidden gap-2 py-4' linkClassName="w-11/12 mx-auto text-lg font-medium text-center py-3 " />

        <HeaderCta className='w-full flex items-center justify-center p-5 pt-2' />

      </DrawerContent>


    </Drawer>
  );
};
