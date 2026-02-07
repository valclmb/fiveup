"use client";

import { usePathname } from "next/navigation";
import AnimatedBackground from "./animated-background";

const CONTENT_PAGE_PATHS = ["/book-a-demo", "/affiliate"];

export default function ConditionalAnimatedBackground() {
  const pathname = usePathname();
  const isContentPage = CONTENT_PAGE_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isContentPage) return null;
  return <AnimatedBackground />;
}
