import React from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Mock products data - in a real app, this would come from an API
const allProducts = [
  {
    id: 1,
    name: "Premium Fountain Pen",
    price: 89.99,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 125,
    category: "stationery"
  },
  {
    id: 2,
    name: "Leather Notebook Set",
    price: 45.99,
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 89,
    category: "stationery"
  },
  {
    id: 3,
    name: "Luxury Gift Box",
    price: 125.99,
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 203,
    category: "gifts"
  },
  {
    id: 4,
    name: "Educational Building Blocks",
    price: 34.99,
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 156,
    category: "toys"
  },
  {
    id: 5,
    name: "Professional Tennis Racket",
    price: 199.99,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 78,
    category: "sports"
  }
];

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  const categoryProducts = allProducts.filter(
    product => product.category === category?.toLowerCase()
  );

  const categoryTitles: { [key: string]: string } = {
    stationery: "Stationery",
    gifts: "Gifts",
    toys: "Toys", 
    sports: "Sports"
  };

  const categoryTitle = category ? categoryTitles[category.toLowerCase()] || category : "Category";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {categoryTitle} Products
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover our collection of {categoryTitle.toLowerCase()} products
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;