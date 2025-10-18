import firebase_app from "../config";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { Queue } from "@/types/queue";

const db = getFirestore(firebase_app);

export default async function getQueues(): Promise<{ result: Queue[] | null; error: any }> {
  let result: Queue[] | null = null;
  let error = null;

  try {
    const q = query(collection(db, "queues"), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);

    const queues: Queue[] = [];
    querySnapshot.forEach((doc) => {
      queues.push({
        id: doc.id,
        ...doc.data()
      } as Queue);
    });

    result = queues;
  } catch (e) {
    error = e;
  }

  return { result, error };
}
