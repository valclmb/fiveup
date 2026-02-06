import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
      <head>
        <Script
          async
          defer
          src='https://cdn.affonso.io/js/pixel.min.js'
          data-affonso='cml97lrfc000h13su8oi120f1'
          data-cookie_duration='4'
          strategy='afterInteractive'
        />
      </head>
      <body className="antialiased relative">
        {/* Rewardful - scripts first, exact order from docs. Do not nest in Head. */}
        <Script id="rewardful-queue" strategy="beforeInteractive">
          {`(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`}
        </Script>
        <Script
          src="https://r.wdfl.co/rw.js"
          data-rewardful="8d8269"
          strategy="afterInteractive"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
