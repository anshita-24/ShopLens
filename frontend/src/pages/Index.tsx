import React, { useState, useRef } from "react";
import {
  Camera,
  Search,
  Upload,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CameraCapture from "@/components/CameraCapture";
import SearchResults from "@/components/SearchResults";
import ProductDetails from "@/components/ProductDetails";

const Index = () => {
  const [activeTab, setActiveTab] = useState("camera");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageCapture = async (imageData: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(imageData);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "captured-image.png");

      const response = await fetch("http://localhost:3000/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("🔍 Received response from backend:", data);

      if (data?.similarProducts?.length > 0) {
        setSearchResults(data.similarProducts);
        setActiveTab("results");
      } else {
        alert("No similar products found.");
        setActiveTab("camera");
      }
    } catch (error) {
      console.error("🚨 Error uploading image:", error);
      alert("Something went wrong while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          handleImageCapture(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setActiveTab("details");
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
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Zap className="h-3 w-3 mr-1" />
              AI Ready
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "camera" && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Discover Products with AI</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Take a photo or upload an image to find similar products, get recommendations, and discover the best deals.
              </p>
            </div>

            {/* Upload & Camera */}
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
                  <p className="text-gray-600">Have an image saved? Upload it to search for similar products.</p>
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
              {[
                {
                  icon: <Search className="h-6 w-6 text-blue-600" />,
                  title: "Visual Search",
                  desc: "Advanced AI identifies products from images with high accuracy",
                  bg: "bg-blue-100",
                },
                {
                  icon: <ShoppingBag className="h-6 w-6 text-green-600" />,
                  title: "Smart Recommendations",
                  desc: "Get personalized product suggestions and bundle deals",
                  bg: "bg-green-100",
                },
                {
                  icon: <Zap className="h-6 w-6 text-orange-600" />,
                  title: "Real-time Results",
                  desc: "Instant product matching across multiple retailers",
                  bg: "bg-orange-100",
                },
              ].map((f, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className={`mx-auto p-3 ${f.bg} rounded-full w-fit`}>{f.icon}</div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <SearchResults
            results={searchResults}
            isLoading={isSearching}
            onProductSelect={handleProductSelect}
            onBack={() => setActiveTab("camera")}
          />
        )}

        {activeTab === "details" && selectedProduct && (
          <ProductDetails product={selectedProduct} onBack={() => setActiveTab("results")} />
        )}
      </main>
    </div>
  );
};

export default Index;
