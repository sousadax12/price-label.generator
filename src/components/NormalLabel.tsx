'use client'
import { Product, ProductCategory, Unit } from "@/types/product";
import Image from "next/image";

interface NormalLabelProps {
  product: Product;
}

export default function NormalLabel({ product }: NormalLabelProps) {


  const getCategoryImage = (category: ProductCategory) => {
    return `/${category.toLowerCase()}.png`;
  };

  return (
    <div 
      className="print-label border border-gray-300 p-3 bg-white print:border-black print:border-2 print:break-inside-avoid print:page-break-inside-avoid relative"
      style={{
        backgroundImage: 'url(/precario.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header with Category and Unit */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Image 
            src={getCategoryImage(product.category)} 
            alt={product.category}
            width={52}
            height={52}
            className="w-12 h-12 object-contain mt-4"
          />
        </div>
        <div className="flex flex-col items-end">
          <div className="text-6xl items-end italic text-gray-900 print:text-black">
              {Number.parseFloat(product.price).toFixed(2)}
            </div>
          <span className="text-md items-end text-right font-medium text-gray-600 print:text-black">
            €/ {product.unit === Unit.KG ? 'kg' : 'un'}
          </span>
        </div>
      </div>

      {/* Product Description */}
      <div className="mb-3 flex items-center justify-center" style={{ height: '70px', width: '100%', backgroundColor: 'oklch(0.98 0 0)' }}>
        <span className="font-bold text-3xl leading-tight text-gray-900 print:text-black break-words text-center">
          {product.description}
        </span>
      </div>
    </div>
  );
}