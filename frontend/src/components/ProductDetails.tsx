import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, Share2, ShoppingBag, ExternalLink, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BACKEND_URL = "http://localhost:3000";

const ProductDetails = ({ product, onBack }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const productImageUrl = product.image.startsWith("http")
    ? product.image
    : `${BACKEND_URL}/products/${product.image}`;

  const productImages = [productImageUrl];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button onClick={onBack} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Product Details</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={productImages[selectedImage]} 
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            <Badge className="absolute top-4 left-4 bg-green-500 text-white">
              {product.confidence}% AI Match
            </Badge>
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-green-600">{product.price}</span>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-600">4.2 (156 reviews)</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              This modern minimalist product is designed for both style and functionality.
            </p>
          </div>

          {/* Store Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">W</span>
                  </div>
                  <div>
                    <p className="font-semibold">{product.store}</p>
                    <p className="text-sm text-gray-600">Sold and shipped by Walmart</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit Store
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              Buy Now
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Truck className="h-6 w-6 mx-auto text-green-600" />
              <p className="text-sm font-medium">Free Shipping</p>
            </div>
            <div className="text-center space-y-2">
              <Shield className="h-6 w-6 mx-auto text-blue-600" />
              <p className="text-sm font-medium">2 Year Warranty</p>
            </div>
            <div className="text-center space-y-2">
              <RotateCcw className="h-6 w-6 mx-auto text-purple-600" />
              <p className="text-sm font-medium">30 Day Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from Backend */}
      {product.similar && product.similar.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">You Might Also Like</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {product.similar.map((item) => {
              const imageUrl = item.image.startsWith("http")
                ? item.image
                : `${BACKEND_URL}/products/${item.image}`;
              return (
                <Card key={item.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-semibold mb-1">{item.name}</h4>
                    <p className="text-green-600 font-bold">{item.price}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
