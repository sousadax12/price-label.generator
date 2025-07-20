'use client'
import { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import { useAuthContext } from "@/context/AuthContext";
import { Product, ProductFormData, LabelSize } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2, AlertCircle, Printer, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductsTable from "@/components/ProductsTable";
import ProductDialog from "@/components/ProductDialog";
import NormalLabel from "@/components/NormalLabel";
import SmallLabel from "@/components/SmallLabel";
import getProducts from "@/firebase/firestore/getProducts";
import addData from "@/firebase/firestore/addData";
import updateData from "@/firebase/firestore/updateData";
import deleteData from "@/firebase/firestore/deleteData";

export default function LabelsPage() {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { result, error } = await getProducts();
      
      if (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } else if (result) {
        setProducts(result);
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
      loadProducts();
    }
  }, [user]);

  const handleCreateProduct = async (formData: ProductFormData) => {
    try {
      setIsSubmitting(true);
      const newProductId = `product_${Date.now()}`;
      const { error } = await addData("products", newProductId, formData);
      
      if (error) {
        console.error("Error creating product:", error);
        setError("Failed to create product. Please try again.");
      } else {
        await loadProducts();
        setDialogOpen(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while creating the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (formData: ProductFormData) => {
    if (!editingProduct?.id) return;
    
    try {
      setIsSubmitting(true);
      const { error } = await updateData("products", editingProduct.id, formData);
      
      if (error) {
        console.error("Error updating product:", error);
        setError("Failed to update product. Please try again.");
      } else {
        await loadProducts();
        setDialogOpen(false);
        setEditingProduct(undefined);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while updating the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    
    try {
      setIsSubmitting(true);
      const { error } = await deleteData("products", deletingProductId);
      
      if (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      } else {
        await loadProducts();
        setDeleteDialogOpen(false);
        setDeletingProductId(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while deleting the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePrint = async (productId: string, newPrintValue: boolean) => {
    try {
      const { error } = await updateData("products", productId, { print: newPrintValue });
      
      if (error) {
        console.error("Error updating print status:", error);
        setError("Failed to update print status. Please try again.");
      } else {
        // Update local state immediately for better UX
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, print: newPrintValue }
              : product
          )
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while updating print status.");
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      setIsSubmitting(true);
      const newProductId = `product_${Date.now()}`;
      
      // Create a copy of the product without the id, and set print to false by default
      const duplicatedProduct: ProductFormData = {
        category: product.category,
        description: `${product.description} (Copy)`,
        unit: product.unit,
        price: product.price,
        taxStatus: product.taxStatus,
        print: false,
        labelSize: product.labelSize
      };
      
      const { error } = await addData("products", newProductId, duplicatedProduct);
      
      if (error) {
        console.error("Error duplicating product:", error);
        setError("Failed to duplicate product. Please try again.");
      } else {
        await loadProducts();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred while duplicating the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateDialog = () => {
    setEditingProduct(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const openDeleteDialog = (productId: string) => {
    setDeletingProductId(productId);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (formData: ProductFormData) => {
    if (editingProduct) {
      handleUpdateProduct(formData);
    } else {
      handleCreateProduct(formData);
    }
  };

  const printableProductsCount = products.filter(product => product.print).length;

  const handlePrintLabels = () => {
    const printableProducts = products.filter(product => product.print);
    if (printableProducts.length === 0) return;

    // Create a temporary container for printing
    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.top = '0';
    
    // Add print-specific styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      @media print {
        body * { visibility: hidden; }
        .print-container, .print-container * { visibility: visible; }
        .print-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        .print-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 10px !important;
          width: 100% !important;
        }
        .print-label {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
      }
    `;
    document.head.appendChild(printStyles);
    
    printContainer.className = 'print-container';
    document.body.appendChild(printContainer);

    // Create React elements for each printable product
    const PrintContent = () => (
      <div className="print-grid">
        {printableProducts.map((product) => (
          <div key={product.id} className="">
            {product.labelSize === LabelSize.SMALL ? (
              <SmallLabel product={product} />
            ) : (
              <NormalLabel product={product} />
            )}
          </div>
        ))}
      </div>
    );

    const root = createRoot(printContainer);
    root.render(<PrintContent />);

    // Wait a bit for rendering, then print
    setTimeout(() => {
      window.print();
      
      // Cleanup after printing
      setTimeout(() => {
        document.body.removeChild(printContainer);
        document.head.removeChild(printStyles);
      }, 100);
    }, 100);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Labels</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and generate labels
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePrintLabels}
            disabled={printableProductsCount === 0}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Labels ({printableProductsCount})
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
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

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : (
            <ProductsTable
              products={products}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onTogglePrint={handleTogglePrint}
              onDuplicate={handleDuplicateProduct}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}