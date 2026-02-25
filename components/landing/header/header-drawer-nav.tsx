"use client"
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { LANDING_NAV } from './header';

export const HeaderDrawerNav = ({ className }: { className?: string }) => {
  const staggerDelay = 0.1;
  const duration = 0.6;
  const baseDelay = 0.2;

  return (
    <nav className={cn('w-full', className)}>
      <ul className="flex flex-col text-sm font-semibold">
        {LANDING_NAV.map((link, index) => (
          <motion.li
            key={link.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: baseDelay + index * staggerDelay,
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
            {index < LANDING_NAV.length - 1 && (
              <div className="border-b border-border mx-3" />
            )}
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}