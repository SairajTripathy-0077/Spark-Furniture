import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/navbar/Header";
import Footer from "@/components/Footer/Footer";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { FavoritesProvider } from "@/context/FavoritesContext";
import FavoritesDrawer from "@/components/FavoritesDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkfurnitures.in"),
  title: {
    default: "Spark Furnitures | Premium Custom Furniture in Bhubaneswar, Odisha",
    template: "%s | Spark Furnitures",
  },
  description: "Spark Furnitures is Odisha's leading ISO-certified manufacturer of luxury office chairs, executive desks, modular workstations, custom wooden sofas, premium beds, and home interior decor.",
  keywords: [
    "furniture store bhubaneswar",
    "office furniture odisha",
    "custom modular furniture",
    "executive office chairs bhubaneswar",
    "luxury sofa sets odisha",
    "ISO certified furniture manufacturer",
    "best furniture showroom bhubaneswar",
    "premium modular workstation",
    "ergonomic study tables",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Spark Furnitures | Premium Custom Furniture in Bhubaneswar, Odisha",
    description: "ISO-certified manufacturer of luxury office chairs, modular office workstations, wooden sofas, custom beds, and modular home furniture.",
    url: "https://sparkfurnitures.in",
    siteName: "Spark Furnitures",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 500,
        alt: "Spark Furnitures Luxury Showroom Hero",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <FavoritesProvider>
            <Header/>
            <main className="flex-1">
              {children}
            </main>
            <CartDrawer />
            <FavoritesDrawer />
            <Footer />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
