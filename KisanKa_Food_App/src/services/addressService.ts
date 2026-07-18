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
} from "@react-native-firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { Address } from "../types/address";
import { logApiError, logApiResponse } from "../utils/apiLogger";

export const addAddress = async (uid: string, address: Address) => {
  const startedAt = Date.now();
  try {
    const docRef = await addDoc(collection(db, "users", uid, "addresses"), {
      ...address,
      createdAt: serverTimestamp(),
    });

    logApiResponse("firestore", `addDoc users/${uid}/addresses`, {
      startedAt,
      summary: `created ${docRef.id}`,
    });
  } catch (error) {
    logApiError("firestore", `addDoc users/${uid}/addresses`, error);
    throw error;
  }
};

export const getAddresses = async (uid: string) => {
  const startedAt = Date.now();
  try {
    const q = query(
      collection(db, "users", uid, "addresses"),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    const addresses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    logApiResponse("firestore", `getDocs users/${uid}/addresses`, {
      startedAt,
      summary: `${addresses.length} addresses`,
      body: addresses,
    });

    return addresses;
  } catch (error) {
    logApiError("firestore", `getDocs users/${uid}/addresses`, error);
    throw error;
  }
};

export const deleteAddress = async (uid: string, id: string) => {
  const startedAt = Date.now();
  try {
    await deleteDoc(doc(db, "users", uid, "addresses", id));

    logApiResponse("firestore", `deleteDoc users/${uid}/addresses/${id}`, {
      startedAt,
      summary: "deleted",
    });
  } catch (error) {
    logApiError("firestore", `deleteDoc users/${uid}/addresses/${id}`, error);
    throw error;
  }
};

export const updateAddress = async (
  uid: string,
  id: string,
  address: Partial<Address>,
) => {
  const startedAt = Date.now();
  try {
    await updateDoc(doc(db, "users", uid, "addresses", id), address);

    logApiResponse("firestore", `updateDoc users/${uid}/addresses/${id}`, {
      startedAt,
      summary: "updated",
    });
  } catch (error) {
    logApiError("firestore", `updateDoc users/${uid}/addresses/${id}`, error);
    throw error;
  }
};
