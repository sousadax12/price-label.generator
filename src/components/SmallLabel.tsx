'use client'
import { Product, Unit } from "@/types/product";

interface SmallLabelProps {
  product: Product;
}

export default function SmallLabel({ product }: SmallLabelProps) {

  return (
    <div 
      className="print-label-small border border-gray-300 p-2 bg-white print:border-black print:border-2 print:break-inside-avoid print:page-break-inside-avoid relative"
      style={{
        backgroundImage: 'url(/etiqueta_pequena.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header with Unit and Price */}
      <div className="flex justify-between flex-col items-end">
        <div className="flex flex-col items-end">
          <span className="text-3xl italic text-gray-900 print:text-black">
              {product.price}
            </span>
          <span className="text-xs items-end text-right font-medium text-gray-600 print:text-black">
            €/ {product.unit === Unit.KG ? 'kg' : 'un'}
          </span>
        </div>
      </div>

      {/* Product Description */}
      <div className="mb-3 flex items-center justify-center" style={{ height: '70px', width: '100%', backgroundColor: 'oklch(0.98 0 0)' }}>
        <span className="font-bold text-2xl leading-tight text-gray-900 print:text-black break-words">
          {product.description}
        </span>
      </div>
    </div>
  );
}