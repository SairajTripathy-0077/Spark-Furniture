import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn how Spark Furniture designs and manufactures premium, handcrafted home and office furniture in Bhubaneswar, Odisha. Explore our 14+ years of design expertise, custom workshops, and prestigious clients.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Spark Furniture',
    description: 'Explore the story of Spark Furniture. We custom-design and manufacture luxury corporate office desks, ergonomic seating, modular furniture, and premium home interiors in Bhubaneswar, Odisha.',
    url: 'https://www.sparkfurnitures.in/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
