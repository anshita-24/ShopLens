import React from 'react';
import { ArrowLeft, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BACKEND_URL = "http://localhost:3000";

type Props = {
  results: any[];
  isLoading: boolean;
  uploadedImageUrl: string;
  onProductSelect: (product: any) => void;
  onBack: () => void;
};

const SearchResults: React.FC<Props> = ({
  results,
  isLoading,
  uploadedImageUrl,
  onProductSelect,
  onBack
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Analyzing Image...</h2>
        </div>

        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">AI Processing Your Image</h3>
          <p className="text-gray-600">Searching through millions of products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Search Results</h2>
            <p className="text-gray-600">{results.length} products found</p>
          </div>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Uploaded Image */}
      {uploadedImageUrl && (
        <div className="rounded-lg border p-4 bg-white text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">Uploaded Image</p>
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="max-h-[300px] mx-auto object-contain rounded-lg border"
          />
        </div>
      )}

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((product, index) => {
          const imageUrl = product.image.startsWith("http")
            ? product.image
            : `${BACKEND_URL}/products/${product.image}`;

          return (
            <Card
              key={product._id || index}
              className="hover:shadow-lg transition-all duration-300 group"
              onClick={() => onProductSelect(product)}
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-[300px] object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                  Similar
                </Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">{product.price}</span>
                    <Badge variant="secondary">{product.style}</Badge>
                  </div>
                </div>

                {/* Walmart Button */}
                {product.link && (
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block pt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center border border-purple-600 text-purple-700 hover:bg-purple-50"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Walmart
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center pt-6">
        <Button variant="outline" size="lg">
          Load More Results
        </Button>
      </div>
    </div>
  );
};

export default SearchResults;
