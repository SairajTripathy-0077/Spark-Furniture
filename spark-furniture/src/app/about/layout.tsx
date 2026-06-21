import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Spark Furnitures is a leading manufacturer of premium, handcrafted luxury office and home furniture in Bhubaneswar, Odisha. ISO-certified standards since 2012.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Spark Furnitures',
    description: 'Learn about our 14+ years of furniture design excellence, ISO certified quality standards, leadership board, and corporate clients in Bhubaneswar, Odisha.',
    url: 'https://www.sparkfurnitures.in/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
