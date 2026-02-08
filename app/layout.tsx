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
        <Script
          type="text/javascript"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="90853af1-14d6-4f8d-b13b-c3ad50ae74ae";(function(){var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
          }}
        />

      </head>
      <body className="antialiased relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
