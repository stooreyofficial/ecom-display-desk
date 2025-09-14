import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import productHeadphones from "@/assets/product-headphones.jpg";
import productPhone from "@/assets/product-phone.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productLaptop from "@/assets/product-laptop.jpg";

const featuredProducts = [
  {
    id: 1,
    name: "Premium Art Supplies Set",
    price: 89,
    originalPrice: 119,
    image: productHeadphones,
    rating: 4.8,
    reviews: 124,
    category: "Stationery",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 2,
    name: "Luxury Gift Box Collection",
    price: 149,
    image: productPhone,
    rating: 4.9,
    reviews: 89,
    category: "Gifts",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 3,
    name: "Educational Building Blocks",
    price: 79,
    originalPrice: 99,
    image: productWatch,
    rating: 4.7,
    reviews: 156,
    category: "Toys",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 4,
    name: "Professional Tennis Racket",
    price: 299,
    image: productLaptop,
    rating: 4.8,
    reviews: 67,
    category: "Sports",
    isNew: true,
    isOnSale: false,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that combine cutting-edge technology with exceptional design.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/products">
            <Button size="lg" className="group">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;