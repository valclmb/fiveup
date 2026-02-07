import { cn } from '@/lib/utils';
import Link from 'next/link';

export const Nav = ({ className, linkClassName }: { className?: string, linkClassName?: string }) => {
  const links = [
    { label: "Features", href: "#features" },
    {
      label: 'Pricing',
      href: '/pricing'
    },
    {
      label: 'Affiliate',
      href: '/affiliate'
    },
    {
      label: 'Book a demo',
      href: '/book-a-demo'
    },
  ];

  return (
    <nav>
      <ul className={cn('flex  md:flex-row items-center gap-2 text-xs md:text-sm font-semibold  ', className)}>
        {links.map((link) => (
          <li key={link.href} className={cn('px-6 py-1 rounded-md hover:cursor-pointer hover:text-primary transition-all duration-500 hover:bg-tertiary/50', linkClassName)}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>

    </nav>
  );
};
