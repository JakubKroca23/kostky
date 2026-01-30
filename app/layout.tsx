import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kostky - Online Hra",
  description: "Multiplayer hra se 6 kostkami s AI hráči a žebříčkem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={`${geistSans.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
