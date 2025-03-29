'use client';
import "./globals.css";
import { ThemeProvider } from '../lib/ThemeContext';
import ThemeToggle from '../lib/ThemeToggle';
import ThemeStyles from '../lib/ThemeStyles';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggle />
          <ThemeStyles />
        </ThemeProvider>
      </body>
    </html>
  );
}