"use client";

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const Nav = ({
  className,
  linkClassName,
  drawer,
}: {
  className?: string;
  linkClassName?: string;
  drawer?: boolean;
}) => {
  const links = [
    { label: "Features", href: "#features" },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Affiliate', href: '/affiliate' },
    { label: 'Book a demo', href: '/book-a-demo' },
  ];

  if (drawer) {
    const staggerDelay = 0.1;
    const duration = 0.6; 
    const baseDelay = 0.2; 

    return (
      <nav className={cn('w-full', className)}>
        <ul className="flex flex-col text-sm font-semibold">
          {links.map((link, index) => (
            <motion.li
              key={link.href}
              className={linkClassName}
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration,
                delay: baseDelay + (index * staggerDelay), 
                ease: [0.215, 0.61, 0.355, 1], 
              }}
            >
              <Link
                href={link.href}
                className={cn(
                  'flex w-full items-center justify-between gap-2 py-4 px-3 text-left transition-colors',
                  'hover:text-primary hover:bg-tertiary/50'
                )}
              >
                <span>{link.label}</span>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
              {index < links.length - 1 && (
                <div className="border-b border-border mx-3" />
              )}
            </motion.li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav>
      <ul className={cn('flex md:flex-row items-center gap-2 text-xs md:text-sm font-semibold', className)}>
        {links.map((link) => (
          <li
            key={link.href}
            className={cn(
              'px-6 py-1 rounded-md hover:cursor-pointer transition-all duration-500',
              'hover:text-primary hover:bg-tertiary/50',
              linkClassName
            )}
          >
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};