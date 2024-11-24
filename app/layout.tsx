import type { Metadata } from "next";
import Image from "next/image";

import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Todo List App",
  description: "Manage your daily Todos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <Image
            src="../logo.svg"
            alt="Todo App logo"
            width={226}
            height={48}
          />
        </header>
        <main>
          <div id="content">{children}</div>
        </main>
      </body>
    </html>
  );
}
