import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { createContext, useContext, useState } from "react";

import { db } from "../firebase/firebaseConfig";

const OrderContext = createContext<any>(null);

export const OrderProvider = ({ children }: any) => {
  const [orders, setOrders] = useState<any[]>([]);

  const placeOrder = async (order: any, userId: string) => {
    try {
      console.log("placeOrder called");
      console.log("Order Data:", order);
      console.log("User ID:", userId);

      const docRef = await addDoc(collection(db, "orders"), {
        ...order,
        userId,
        createdAt: Timestamp.now(),
      });

      console.log("Order saved successfully:", docRef.id);

      setOrders((prev) => [
        ...prev,
        {
          id: docRef.id,
          ...order,
        },
      ]);

      return docRef.id;
    } catch (error) {
      console.log("ORDER SAVE ERROR:", error);
      throw error;
    }
  };

  const loadOrders = async (userId: string) => {
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

      setOrders(data);
    } catch (error) {
      console.log("LOAD ORDER ERROR:", error);
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
