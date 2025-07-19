import firebase_app from "../config";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { Product } from "@/types/product";

const db = getFirestore(firebase_app);

export default async function getProducts(): Promise<{ result: Product[] | null; error: any }> {
  let result: Product[] | null = null;
  let error = null;

  try {
    const q = query(collection(db, "products"), orderBy("description", "asc"));
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    result = products;
  } catch (e) {
    error = e;
  }

  return { result, error };
}