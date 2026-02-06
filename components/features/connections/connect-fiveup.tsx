"use client";

import { Item } from "@/components/ui/item";
import { ShineBorder } from "@/components/ui/shine-border";
import Image from "next/image";

export function ConnectFiveUp() {
  return (
    <Item variant="outline" className=" bg-background border flex justify-center items-center">
      <ShineBorder borderWidth={1} shineColor={["var(--primary)", "yellow", "cyan"]} />
      <Image src="/logos/logo-white.svg" alt="FiveUp" width={150} height={24} />
    </Item>
  );
}

export default ConnectFiveUp;
