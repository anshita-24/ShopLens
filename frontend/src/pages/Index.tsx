import React, { useState, useRef } from "react";
import {
  Camera,
  Search,
  Upload,
  Zap,
  ShoppingBag,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CameraCapture from "@/components/CameraCapture";
import SearchResults from "@/components/SearchResults";
import ProductDetails from "@/components/ProductDetails";

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"camera" | "results" | "details">("camera");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setUploadedImageUrl(data.imageUrl);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-100">
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
          <p className="text-sm text-gray-500">
            Connected to Walmart
          </p>
        </div>
      </div>
    </div>
  </div>
</header>


      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {activeTab === "camera" && (
          <div className="space-y-10 animate-fade-in">
            {/* Hero */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Snap. Search. <span className="text-blue-600">Shop.</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload an image or take a photo to discover products directly from Walmart’s catalog using our AI-powered visual search.
              </p>
            </div>

            {/* Upload & Camera */}
            <div className="grid md:grid-cols-2 gap-6">
              <CameraCapture onCapture={handleImageCapture} />
              <Card className="hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-blue-400">
                <CardHeader className="text-center">
                  <div className="mx-auto p-4 bg-purple-100 rounded-full w-fit">
                    <Upload className="h-8 w-8 text-purple-600 animate-bounce" />
                  </div>
                  <CardTitle>Upload an Image</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">Upload a product image to find similar styles available on Walmart.</p>
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
                  icon: <Wand2 className="h-6 w-6 text-indigo-600" />,
                  title: "Walmart Connected",
                  desc: "All results are linked directly to live product pages on Walmart.",
                  bg: "bg-indigo-100",
                },
                {
                  icon: <ShoppingBag className="h-6 w-6 text-green-600" />,
                  title: "Smart AI Matching",
                  desc: "Our AI finds the best visual matches from uploaded photos.",
                  bg: "bg-green-100",
                },
                {
                  icon: <Zap className="h-6 w-6 text-orange-600" />,
                  title: "Instant Results",
                  desc: "Lightning-fast search experience with real-time response.",
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
            uploadedImageUrl={uploadedImageUrl}
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
