"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DM_Sans,
  Fraunces,
  Inter,
  Lora,
  Outfit,
} from "next/font/google";

export type DesignSystemFont =
  | "inter"
  | "dm-sans"
  | "fraunces"
  | "outfit"
  | "lora";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const FONT_OPTIONS: {
  value: DesignSystemFont;
  label: string;
  className: string;
}[] = [
    { value: "inter", label: "Inter", className: inter.className },
    { value: "dm-sans", label: "DM Sans", className: dmSans.className },
    { value: "outfit", label: "Outfit", className: outfit.className },
    { value: "fraunces", label: "Fraunces", className: fraunces.className },
    { value: "lora", label: "Lora", className: lora.className },
  ];

function getFontClassName(value: DesignSystemFont): string {
  return FONT_OPTIONS.find((o) => o.value === value)?.className ?? inter.className;
}

export type FontSelectProps = {
  value: DesignSystemFont;
  onValueChange: (value: DesignSystemFont) => void;
  placeholder?: string;
  triggerClassName?: string;
  className?: string;
};

export function FontSelect({
  value,
  onValueChange,
  placeholder = "Choisir une police",
  triggerClassName,
  className,
}: FontSelectProps) {
  const selectedFontClass = getFontClassName(value);

  return (
    <Select
      value={value}
      onValueChange={(v) => v && onValueChange(v as DesignSystemFont)}
    >
      <SelectTrigger
        className={cn("w-[220px]", selectedFontClass, triggerClassName)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={className}>
        {FONT_OPTIONS.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className={cn("min-w-[200px]", opt.className)}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { FONT_OPTIONS };
