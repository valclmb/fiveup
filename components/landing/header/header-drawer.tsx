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
import { HeaderDrawerNav } from "./header-drawer-nav";


export const HeaderDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer direction='top' open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="ghost" className="lg:hidden cursor-pointer">
          <Menu className="size-6" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="z-110 m-3 rounded-t-lg border-card bg-background/80 backdrop-blur-3xl after:bg-transparent! ">
        <DrawerHeader className="flex items-center justify-center pt-9 pb-2">
          <Image src="/logos/logo-white.svg" alt="Logo" width={80} height={10} />
        </DrawerHeader>

        <HeaderDrawerNav key={isOpen ? 'open' : 'closed'} />

        <HeaderCta direction="vertical" />

      </DrawerContent>


    </Drawer>
  );
};