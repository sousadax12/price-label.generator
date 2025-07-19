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

const DEFAULT_FORM_DATA: ProductFormData = {
  category: ProductCategory.MERCEARIA,
  unit: Unit.UN,
  price: "",
  description: "",
  taxStatus: false,
  print: true,
  labelSize: LabelSize.NORMAL,
};

const PRICE_REGEX = /^\d+([,\.]\d{1,2})?$/;

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: T[];
  placeholder: string;
  onChange: (value: T) => void;
}

function SelectField<T extends string>({ label, value, options, placeholder, onChange }: SelectFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_FORM_DATA);

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});


  useEffect(() => {
    if (product) {
      const safeCategory = Object.values(ProductCategory).includes(product.category as ProductCategory) 
        ? product.category as ProductCategory 
        : ProductCategory.MERCEARIA;
      
      const safeUnit = Object.values(Unit).includes(product.unit as Unit) 
        ? product.unit as Unit 
        : Unit.UN;
      
      const safeLabelSize = product.labelSize && Object.values(LabelSize).includes(product.labelSize as LabelSize)
        ? product.labelSize as LabelSize
        : LabelSize.NORMAL;
      
      setFormData({
        category: safeCategory,
        unit: safeUnit,
        price: product.price || "",
        description: product.description || "",
        taxStatus: product.taxStatus || false,
        print: product.print !== undefined ? product.print : true,
        labelSize: safeLabelSize,
      });
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
    setErrors({});
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (!PRICE_REGEX.test(formData.price)) {
      newErrors.price = "Price must be in format: 24,95 or 24.95";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        price: formData.price.replace('.', ','),
      });
    }
  };

  const handlePriceChange = (value: string) => {
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
        <SelectField
          label="Category"
          value={formData.category}
          options={Object.values(ProductCategory)}
          placeholder="Select category"
          onChange={(value: ProductCategory) => {
            if(value) {
              setFormData(prev => ({ ...prev, category: value }));
            }
          }}
        />

        <SelectField
          label="Unit"
          value={formData.unit}
          options={Object.values(Unit)}
          placeholder="Select unit"
          onChange={(value: Unit) => {
            console.log("Unit changed to", value);
            if(value) {
              setFormData(prev => ({ ...prev, unit: value }));
            }
          }}
        />

        <SelectField
          label="Label Size"
          value={formData.labelSize}
          options={Object.values(LabelSize)}
          placeholder="Select label size"
          onChange={(value: LabelSize) => {
            if(value) {
              setFormData(prev => ({ ...prev, labelSize: value }));
            }
          }}
        />
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