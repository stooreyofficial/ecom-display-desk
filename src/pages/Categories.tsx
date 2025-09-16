import React from "react";
import Navigation from "@/components/Navigation";
import CategoryGrid from "@/components/CategoryGrid";
import Footer from "@/components/Footer";

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Shop by Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of products organized into convenient categories to help you find exactly what you need.
          </p>
        </div>
        <CategoryGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Categories;