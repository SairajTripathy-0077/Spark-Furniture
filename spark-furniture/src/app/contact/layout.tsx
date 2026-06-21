import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Spark Furnitures. Visit our 11,500 sq. ft. showroom in Bhubaneswar, Odisha, call 09777915706, or send a direct custom inquiry.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Spark Furnitures Bhubaneswar',
    description: 'Find our showroom address, phone number, email contact, and send custom design inquiries directly to us on WhatsApp.',
    url: 'https://www.sparkfurnitures.in/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
