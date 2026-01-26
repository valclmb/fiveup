import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });




export const metadata: Metadata = {
  title: "Five Up Review",
  description: "Transformez chaque client en avis 5⭐️",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="fr" className={`${inter.variable} dark`}>
      <body
        className="antialiased relative"
      >
        <Providers>

          {children}
        </Providers>
      </body>
    </html>
  );
}
