import { firebaseStorage, firebaseDb } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

export async function uploadCsvToFirebase(file: File){
  const storage = firebaseStorage();
  const db = firebaseDb();
  const path = `uploads/${Date.now()}_${file.name}`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type || "text/csv" });
  const url = await getDownloadURL(r);
  const meta = await addDoc(collection(db, "uploads"), { path, url, createdAt: Date.now(), type: "csv" });
  return { url, docId: meta.id } as const;
}

export async function getSnapshotFromFirestore(snapshotId: string){
  const db = firebaseDb();
  const d = await getDoc(doc(db, "snapshots", snapshotId));
  return d.exists() ? d.data() : null;
}


