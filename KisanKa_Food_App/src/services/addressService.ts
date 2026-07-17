import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { Address } from "../types/address";

export const addAddress = async (uid: string, address: Address) => {
  await addDoc(collection(db, "users", uid, "addresses"), {
    ...address,
    createdAt: serverTimestamp(),
  });
};

export const getAddresses = async (uid: string) => {
  const q = query(
    collection(db, "users", uid, "addresses"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const deleteAddress = async (uid: string, id: string) => {
  await deleteDoc(doc(db, "users", uid, "addresses", id));
};

export const updateAddress = async (
  uid: string,
  id: string,
  address: Partial<Address>,
) => {
  await updateDoc(doc(db, "users", uid, "addresses", id), address);
};
