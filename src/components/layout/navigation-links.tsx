'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutGrid, CalendarCheck, BookUser, Bot, Search } from 'lucide-react'; // Added Search icon

const navLinks = [
  { href: '/availability', label: 'Disponibilidade', icon: Search }, // Changed icon to Search
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
          size="sm"
          asChild
          className="text-sm"
        >
          <Link href={link.href} className="flex items-center gap-2">
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
