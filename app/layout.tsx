import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Grappa",
  description: "Carte digitale du restaurant La Grappa",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "32x32", type: "image/x-icon" },
      { url: "/icons/favicon-32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-192.png?v=3", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png?v=2", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "La Grappa",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${plusJakarta.variable} ${cormorant.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${plusJakarta.className} flex min-h-full min-w-0 flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
