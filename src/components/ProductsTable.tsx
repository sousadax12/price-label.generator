'use client'
import { useState } from "react";
import { Product, ProductCategory, Unit, LabelSize } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onTogglePrint: (productId: string, newPrintValue: boolean) => void;
}

type SortField = keyof Product;
type SortDirection = 'asc' | 'desc';

export default function ProductsTable({ products, onEdit, onDelete, onTogglePrint }: ProductsTableProps) {
  const [sortField, setSortField] = useState<SortField>('description');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      const comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    return 0;
  });

  const getCategoryColor = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.VACA:
        return "bg-red-100 text-red-800";
      case ProductCategory.QUEIJO:
        return "bg-yellow-100 text-yellow-800";
      case ProductCategory.MERCEARIA:
        return "bg-blue-100 text-blue-800";
      case ProductCategory.PORCO:
        return "bg-pink-100 text-pink-800";
      case ProductCategory.AVE:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="category">Category</SortableHeader>
            <SortableHeader field="description">Description</SortableHeader>
            <SortableHeader field="unit">Unit</SortableHeader>
            <SortableHeader field="price">Price</SortableHeader>
            <SortableHeader field="labelSize">Label Size</SortableHeader>
            <TableHead>Tax Status</TableHead>
            <TableHead>Print</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No products found. Click &quot;Add Product&quot; to get started.
              </TableCell>
            </TableRow>
          ) : (
            sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Badge className={getCategoryColor(product.category)}>
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium max-w-xs truncate">
                  {product.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.unit}</Badge>
                </TableCell>
                <TableCell className="font-mono">€{product.price}</TableCell>
                <TableCell>
                  <Badge 
                    variant={product.labelSize === LabelSize.SMALL ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {product.labelSize || LabelSize.NORMAL}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Checkbox checked={product.taxStatus} disabled />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={product.print} 
                    onCheckedChange={(checked) => 
                      product.id && onTogglePrint(product.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => product.id && onDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}