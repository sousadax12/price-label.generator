'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer, Loader2, AlertCircle } from "lucide-react";
import PrintLabel from "@/components/PrintLabel";
import getProducts from "@/firebase/firestore/getProducts";

export default function PrintPage() {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrintableProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { result, error } = await getProducts();
      
      if (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } else if (result) {
        // Filter only products marked for printing
        const printableProducts = result.filter(product => product.print);
        setProducts(printableProducts);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPrintableProducts();
    }
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  const handleBackToLabels = () => {
    router.push('/labels');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header - Hidden when printing */}
      <div className="print:hidden">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Print Overview</h1>
            <p className="text-muted-foreground">
              {products.length} labels ready for printing
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToLabels}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Labels
            </Button>
            <Button 
              onClick={handlePrint}
              disabled={products.length === 0}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Labels
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setError(null)}
                  className="ml-auto"
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12 print:hidden">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading labels...</span>
        </div>
      ) : (
        /* Labels Grid */
        <div>
          {products.length === 0 ? (
            <Card className="print:hidden">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Printer className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Labels to Print</h3>
                  <p className="text-muted-foreground mb-4">
                    No products are currently marked for printing.
                  </p>
                  <Button onClick={handleBackToLabels}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back to Labels
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Print Instructions - Hidden when printing */}
              <Card className="print:hidden mb-6">
                <CardHeader>
                  <CardTitle>Print Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Use the &quot;Print Labels&quot; button above to open your browser&apos;s print dialog</p>
                    <p>• Recommended paper: A4 or Letter size</p>
                    <p>• For best results, use &quot;Actual Size&quot; or 100% scaling</p>
                    <p>• Consider using label paper (Normal: 8x5cm, Small: 6.5x3.5cm)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Labels Grid - Optimized for printing */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 print:grid-cols-2 print:gap-2">
                {products.map((product) => (
                  <PrintLabel key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}