import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            About Stoorey
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-xl leading-relaxed">
              Welcome to Stoorey, your one-stop destination for quality products across multiple categories. 
              We are passionate about providing our customers with carefully curated items that enhance their daily lives.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">Our Story</h2>
            <p>
              Founded with a vision to make quality products accessible to everyone, Stoorey has grown from a small startup 
              to a trusted online retailer. We believe in the power of thoughtful curation and exceptional customer service.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Stationery</h3>
                <p>High-quality writing instruments, notebooks, and office supplies for students and professionals.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Gifts</h3>
                <p>Thoughtfully selected gifts for every occasion and recipient, from birthdays to holidays.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Toys</h3>
                <p>Educational and entertaining toys that inspire creativity and learning in children of all ages.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Sports</h3>
                <p>Sports equipment and accessories to help you stay active and pursue your athletic goals.</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mt-12 mb-6">Our Commitment</h2>
            <p>
              At Stoorey, we are committed to quality, sustainability, and customer satisfaction. Every product 
              in our catalog is carefully selected to meet our high standards for quality and value.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;