import { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Premium Furniture Showcase | Spark Furniture",
  description: "Browse our complete catalog of handcrafted signature furniture collections from Spark Furniture (also known as Spark Furnitures). Find custom office chairs, modular desks, sofas, beds, and ergonomic workspace designs.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
