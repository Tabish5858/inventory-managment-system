import type { Metadata } from 'next';
import Header from './components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Manage inventory for small businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto pt-4 px-4">
          {children}
        </main>

        {/* Add footer if needed */}
        <footer className="mt-12 py-6 bg-gray-800 text-white text-center">
          <p className="text-sm">© 2025 Inventory Management System</p>
        </footer>
      </body>
    </html>
  );
}
