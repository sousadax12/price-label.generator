'use client'
import { Product, ProductFormData } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export default function ProductDialog({ 
  open, 
  onOpenChange, 
  product, 
  onSubmit, 
  isLoading = false 
}: ProductDialogProps) {
  const isEditing = !!product;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Make changes to the product details below."
              : "Fill in the product information to add a new item to your inventory."
            }
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm
          product={product}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}