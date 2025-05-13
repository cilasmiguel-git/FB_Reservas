'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarCheck, BookUser, Bot, Search } from 'lucide-react';

const navLinks = [
  { href: '/availability', label: 'Disponibilidade', icon: Search },
  { href: '/book', label: 'Solicitar Reserva', icon: CalendarCheck },
  { href: '/my-bookings', label: 'Minhas Reservas', icon: BookUser },
  { href: '/ai-suggest', label: 'Sugestão IA', icon: Bot },
];

export default function NavigationLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navLinks.map((link) => (
        <Button
          key={link.href}
          variant={pathname === link.href ? 'secondary' : 'ghost'}
          size="sm" // Keep size sm for padding consistency
          asChild
          className="text-sm px-2 sm:px-3" // Adjust padding for icon-only vs icon+text
        >
          <Link href={link.href} className="flex items-center gap-2">
            <link.icon className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
