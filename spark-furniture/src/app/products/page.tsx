import { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Premium Furniture Showcase | Spark Furnitures",
  description: "Browse our complete catalog of handcrafted signature furniture collections. Find custom executive office chairs, modular tables, sofa sets, beds, and ergonomic workspace designs.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
