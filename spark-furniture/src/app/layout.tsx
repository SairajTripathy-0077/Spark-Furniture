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
    default: "Spark Furniture | Premium Custom Furniture in Bhubaneswar, Odisha",
    template: "%s | Spark Furniture",
  },
  description: "Spark Furniture designs, manufactures, and customizes premium home and office furniture in Odisha. Explore our range of luxury office chairs, modular workstations, executive desks, custom wooden sofas, premium beds, and turnkey interior solutions.",
  keywords: [
    "spark furniture",
    "spark furnitures",
    "spark furniture bhubaneswar",
    "spark furnitures bhubaneswar",
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
  openGraph: {
    title: "Spark Furniture | Premium Custom Furniture in Bhubaneswar, Odisha",
    description: "Discover premium custom home & office furniture by Spark Furniture in Bhubaneswar, Odisha. We manufacture & design luxury office chairs, executive modular workstations, handcrafted sofas, custom beds, and turnkey interiors.",
    url: "https://www.sparkfurnitures.in",
    siteName: "Spark Furniture",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 500,
        alt: "Spark Furniture Luxury Showroom Hero",
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
        {/* JSON-LD Local Business Structured Data for Google SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FurnitureStore",
              "name": "Spark Furniture",
              "alternateName": "Spark Furnitures",
              "legalName": "Spark Furnitures Pvt Ltd",
              "image": "https://www.sparkfurnitures.in/logo.png",
              "logo": "https://www.sparkfurnitures.in/logo.png",
              "@id": "https://www.sparkfurnitures.in/#organization",
              "url": "https://www.sparkfurnitures.in",
              "telephone": "+919777915706",
              "priceRange": "₹₹",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "492, Service Road south, Dumduma, Beside NH-5, Near Khandagiri Petrol Pump",
                "addressLocality": "Bhubaneswar",
                "addressRegion": "Odisha",
                "postalCode": "751019",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 20.252064,
                "longitude": 85.776632
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "22:00"
              },
              "sameAs": [
                "https://www.instagram.com/sparkfurniture"
              ]
            })
          }}
        />
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
