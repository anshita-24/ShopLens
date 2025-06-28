
import React, { useState, useRef } from 'react';
import { Camera, Search, Upload, Zap, ShoppingBag, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CameraCapture from '@/components/CameraCapture';
import SearchResults from '@/components/SearchResults';
import ProductDetails from '@/components/ProductDetails';

const Index = () => {
  const [activeTab, setActiveTab] = useState('camera');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageCapture = async (imageData) => {
    setIsSearching(true);
    // Simulate AI processing
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: "Modern Minimalist Chair",
          price: "$249.99",
          store: "Walmart",
          confidence: 95,
          image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
          category: "Furniture"
        },
        {
          id: 2,
          name: "Similar Accent Chair",
          price: "$189.99",
          store: "Target",
          confidence: 87,
          image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=300&fit=crop",
          category: "Furniture"
        },
        {
          id: 3,
          name: "Designer Office Chair",
          price: "$329.99",
          store: "Best Buy",
          confidence: 78,
          image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&h=300&fit=crop",
          category: "Furniture"
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
      setActiveTab('results');
    }, 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleImageCapture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setActiveTab('details');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShopLens
                </h1>
                <p className="text-sm text-gray-500">AI-Powered Visual Search</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Zap className="h-3 w-3 mr-1" />
                AI Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'camera' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Discover Products with AI
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Take a photo or upload an image to find similar products, get recommendations, and discover the best deals.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <CameraCapture onCapture={handleImageCapture} />
              
              <Card className="hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-blue-300">
                <CardHeader className="text-center">
                  <div className="mx-auto p-4 bg-purple-100 rounded-full w-fit">
                    <Upload className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Upload Image</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">
                    Have an image saved? Upload it to search for similar products.
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Choose File
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-3">
                <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Visual Search</h3>
                <p className="text-sm text-gray-600">Advanced AI identifies products from images with high accuracy</p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Smart Recommendations</h3>
                <p className="text-sm text-gray-600">Get personalized product suggestions and bundle deals</p>
              </div>
              <div className="text-center space-y-3">
                <div className="mx-auto p-3 bg-orange-100 rounded-full w-fit">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Real-time Results</h3>
                <p className="text-sm text-gray-600">Instant product matching across multiple retailers</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <SearchResults 
            results={searchResults}
            isLoading={isSearching}
            onProductSelect={handleProductSelect}
            onBack={() => setActiveTab('camera')}
          />
        )}

        {activeTab === 'details' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct}
            onBack={() => setActiveTab('results')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
