import type { Metadata } from 'next';
import Header from './components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Track and manage your inventory with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
