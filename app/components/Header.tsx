"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationsMenu from './NotificationsMenu';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Transactions', href: '/transactions' },
    { label: 'Scan Barcode', href: '/barcode' },
  ];

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <h1 className="text-xl font-bold">Inventory Manager</h1>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md transition-colors ${pathname === item.href
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <NotificationsMenu />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden mt-3 pb-2">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${pathname === item.href
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
