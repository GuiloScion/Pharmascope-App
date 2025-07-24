import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PharmaScope: Drug Visualizer and Interaction Checker",
  description: "A professional tool for pharmacists and medical users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-gray-900 dark:bg-slate-900 dark:text-gray-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}