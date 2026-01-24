"use client"

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { useState } from 'react';
import { HeaderCta } from "./header-cta";
import { Nav } from './header-nav';

export const HeaderDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(current => !current);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Drawer direction='top' open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerClose>
        <Button size="icon" variant="outline" className="md:hidden cursor-pointer" onClick={handleToggle}>
          <Menu />
        </Button>
      </DrawerClose>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='text-2xl font-bold text-primary pt-2'>Menu</DrawerTitle>
        </DrawerHeader>

        <Nav className='flex flex-col md:hidden gap-2 py-4' linkClassName="w-11/12 mx-auto text-center py-3 " />

        <HeaderCta className='w-full flex items-center justify-center p-5 pt-2' />

      </DrawerContent>


    </Drawer>
  );
};
