import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mekun Student Report Builder",
  description: "Build and print student progress reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <ThemeRegistry>
        {/* App Header (hidden on print) */}
        <header className="no-print sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo_mekun_academy.png" alt="Mekun Academy" className="h-7 w-7" />
              <span className="font-semibold">Mekun Student Reports</span>
            </div>
            <nav className="text-sm">
              <Link href="/reports/create" className="px-3 py-1 rounded border bg-blue-600 text-white hover:bg-blue-700">Create report</Link>
            </nav>
          </div>
        </header>

  {/* Main content */}
  <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>

        {/* Footer (hidden on print) */}
        <footer className="no-print border-t bg-white/60">
          <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-gray-500">
            © Mekun Academy — Student Report Builder
          </div>
        </footer>
        </ThemeRegistry>
      </body>
    </html>
  );
}
