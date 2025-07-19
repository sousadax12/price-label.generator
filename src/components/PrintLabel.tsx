'use client'
import { Product, LabelSize } from "@/types/product";
import NormalLabel from "./NormalLabel";
import SmallLabel from "./SmallLabel";

interface PrintLabelProps {
  product: Product;
}

export default function PrintLabel({ product }: PrintLabelProps) {
  if (product.labelSize === LabelSize.SMALL) {
    return <SmallLabel product={product} />;
  }
  
  return <NormalLabel product={product} />;
}