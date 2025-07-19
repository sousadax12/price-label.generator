// Enum for common categories found in the data
export enum ProductCategory {
  VACA = "VACA",           // Beef/Cow products
  QUEIJO = "QUEIJO",       // Cheese products
  MERCEARIA = "MERCEARIA", // Grocery items
  PORCO = "PORCO",         // Pork products
  AVE = "AVE",             // Poultry products
  BORREGO = "BORREGO",     // Lamb products
  CABRITO = "CABRITO",     // Goat products
  CHARCUTARIA = "CHARCUTARIA", // Charcuterie/Deli products
  COELHO = "COELHO",       // Rabbit products
  GERAL = "GERAL"          // General products
}

// Enum for units of measurement
export enum Unit {
  KG = "KG",    // Kilogram
  UN = "UN"     // Unit/Piece
}

// Enum for label sizes
export enum LabelSize {
  NORMAL = "Normal",
  SMALL = "Small"
}

// Main product interface using enum types
export interface Product {
  id?: string;               // Firestore document ID (optional for new products)
  category: ProductCategory; // Using enum for type safety
  unit: Unit;                // Using enum for type safety
  price: string;             // e.g., "24,95", "1,20" (price with comma as decimal separator)
  description: string;       // e.g., "PICANHA ANGUS#IRLANDA", "SAL VATEL#RÚSTICO"
  taxStatus: boolean;        // true when 'S' is present, false otherwise
  print: boolean;            // Whether this product should be printed
  labelSize: LabelSize;      // Size of the label (Normal or Small)
}

// Form data type for creating/editing products
export interface ProductFormData {
  category: ProductCategory;
  unit: Unit;
  price: string;
  description: string;
  taxStatus: boolean;
  print: boolean;
  labelSize: LabelSize;
}