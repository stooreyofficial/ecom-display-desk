import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Grid, List } from "lucide-react";
import productHeadphones from "@/assets/product-headphones.jpg";
import productPhone from "@/assets/product-phone.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productLaptop from "@/assets/product-laptop.jpg";

const allProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199,
    originalPrice: 249,
    image: productHeadphones,
    rating: 4.8,
    reviews: 124,
    category: "Audio",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 2,
    name: "Next-Gen Smartphone",
    price: 899,
    image: productPhone,
    rating: 4.9,
    reviews: 89,
    category: "Mobile",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 349,
    originalPrice: 399,
    image: productWatch,
    rating: 4.7,
    reviews: 156,
    category: "Wearables",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 4,
    name: "Ultra-Slim Laptop",
    price: 1299,
    image: productLaptop,
    rating: 4.8,
    reviews: 67,
    category: "Computing",
    isNew: true,
    isOnSale: false,
  },
  // Add more products to demonstrate pagination
  {
    id: 5,
    name: "Professional Camera",
    price: 1599,
    image: productLaptop, // Using laptop image as placeholder
    rating: 4.9,
    reviews: 45,
    category: "Photography",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 6,
    name: "Gaming Console",
    price: 499,
    originalPrice: 549,
    image: productHeadphones, // Using headphones image as placeholder
    rating: 4.7,
    reviews: 234,
    category: "Gaming",
    isNew: false,
    isOnSale: true,
  },
];

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Audio", "Mobile", "Wearables", "Computing", "Photography", "Gaming"];

  const filteredProducts = allProducts.filter(product => 
    selectedCategory === "all" || product.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Page Header */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-section text-foreground mb-4">
              All Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of premium products carefully curated for quality and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </p>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-card border border-card-border rounded-2xl p-6 flex gap-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-48 h-48 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                      {product.category}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        ⭐ {product.rating} ({product.reviews} reviews)
                      </div>
                      <Button>Add to Cart</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;