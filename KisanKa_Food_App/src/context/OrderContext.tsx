import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "@react-native-firebase/firestore";
import { createContext, useContext, useState } from "react";

import { db } from "../firebase/firebaseConfig";
import { logApiError, logApiResponse } from "../utils/apiLogger";

const OrderContext = createContext<any>(null);

export const OrderProvider = ({ children }: any) => {
  const [orders, setOrders] = useState<any[]>([]);

  const placeOrder = async (order: any, userId: string) => {
    const startedAt = Date.now();
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...order,
        userId,
        createdAt: Timestamp.now(),
      });

      logApiResponse("firestore", "addDoc orders", {
        startedAt,
        summary: `created ${docRef.id} for user ${userId}`,
        body: order,
      });

      setOrders((prev) => [
        ...prev,
        {
          id: docRef.id,
          ...order,
        },
      ]);

      return docRef.id;
    } catch (error) {
      logApiError("firestore", "addDoc orders", error);
      throw error;
    }
  };

  const loadOrders = async (userId: string) => {
    const startedAt = Date.now();
    try {
      const q = query(collection(db, "orders"), where("userId", "==", userId));

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      data.sort(
        (a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds,
      );

      logApiResponse("firestore", "getDocs orders", {
        startedAt,
        summary: `${data.length} orders for user ${userId}`,
        body: data,
      });

      setOrders(data);
    } catch (error) {
      logApiError("firestore", "getDocs orders", error);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
