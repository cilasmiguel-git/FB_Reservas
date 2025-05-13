import Link from 'next/link';
import { Building2 } from 'lucide-react';
import NavigationLinks from './navigation-links';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Building2 className="h-7 w-7" />
          <h1 className="text-xl font-semibold">FBSalas</h1>
        </Link>
        <NavigationLinks />
      </div>
    </header>
  );
}
