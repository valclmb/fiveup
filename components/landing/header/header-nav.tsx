import { cn } from "@/lib/utils"
import Link from "next/link"
import { LANDING_NAV } from "./header"


export const HeaderNav = ({ className }: { className?: string }) => {
  return (
    <nav className={cn("flex items-center gap-8 text-md text-muted-foreground", className)}>
      <ul className="flex items-center gap-8 text-md text-muted-foreground">
        {LANDING_NAV.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}