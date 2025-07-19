'use client'
import { Product, Unit } from "@/types/product";

interface SmallLabelProps {
  product: Product;
}

export default function SmallLabel({ product }: SmallLabelProps) {

  return (
    <div 
      className="print-label-small border border-gray-300 p-3 bg-white print:border-black print:border-2 print:break-inside-avoid print:page-break-inside-avoid relative"
      style={{
        backgroundImage: 'url(/etiqueta_pequena.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header with Unit and Price */}
      <div className="flex justify-between flex-col items-end mb-2">
        <div className="flex flex-col items-end">
          <div className="text-2xl italic text-gray-900 print:text-black">
              {Number(product.price).toFixed(2)}
            </div>
          <span className="text-xs items-end text-right font-medium text-gray-600 print:text-black">
            €/ {product.unit === Unit.KG ? 'kg' : 'un'}
          </span>
        </div>
      </div>

      {/* Product Description */}
      <div className="mb-3">
        <span className="font-bold text-sm leading-tight text-gray-900 print:text-black break-words">
          {product.description}
        </span>
      </div>
    </div>
  );
}