'use client'
import { useState, useEffect } from "react";
import { Product, ProductCategory, Unit, LabelSize, ProductFormData } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    category: ProductCategory.MERCEARIA,
    unit: Unit.UN,
    price: "",
    description: "",
    taxStatus: false,
    print: true,
    labelSize: LabelSize.NORMAL,
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        category: product.category,
        unit: product.unit,
        price: product.price,
        description: product.description,
        taxStatus: product.taxStatus,
        print: product.print,
        labelSize: product.labelSize || LabelSize.NORMAL,
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (!/^\d+([,\.]\d{1,2})?$/.test(formData.price)) {
      newErrors.price = "Price must be in format: 24,95 or 24.95";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Normalize price format to use comma as decimal separator
      const normalizedPrice = formData.price.replace('.', ',');
      onSubmit({
        ...formData,
        price: normalizedPrice,
      });
    }
  };

  const handlePriceChange = (value: string) => {
    // Allow only numbers, commas, and dots
    const sanitizedValue = value.replace(/[^0-9,\.]/g, '');
    setFormData(prev => ({ ...prev, price: sanitizedValue }));
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: undefined }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: ProductCategory) => 
              setFormData(prev => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProductCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select
            value={formData.unit}
            onValueChange={(value: Unit) => 
              setFormData(prev => ({ ...prev, unit: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Unit).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="labelSize">Label Size</Label>
          <Select
            value={formData.labelSize}
            onValueChange={(value: LabelSize) => 
              setFormData(prev => ({ ...prev, labelSize: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select label size" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LabelSize).map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g., PICANHA ANGUS#IRLANDA"
          value={formData.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          placeholder="e.g., 24,95 or 1,20"
          value={formData.price}
          onChange={(e) => handlePriceChange(e.target.value)}
          className={errors.price ? "border-red-500" : ""}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price}</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="taxStatus"
            checked={formData.taxStatus}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, taxStatus: checked as boolean }))
            }
          />
          <Label htmlFor="taxStatus">Tax Status</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="print"
            checked={formData.print}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, print: checked as boolean }))
            }
          />
          <Label htmlFor="print">Print Label</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : product ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}