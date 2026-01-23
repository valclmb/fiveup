import { cn } from '@/lib/utils';
import Link from 'next/link';

export const Nav = ({ className, linkClassName }: { className?: string, linkClassName?: string }) => {
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
  ];

  return (
    <nav>
      <ul className={cn('flex  md:flex-row items-center gap-4  text-xs md:text-sm uppercase font-bold ', className)}>
        {links.map((link) => (
          <li key={link.href} className={cn('px-3 py-1 rounded-md hover:cursor-pointer hover:text-primary transition-colors hover:bg-tertiary', linkClassName)}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
