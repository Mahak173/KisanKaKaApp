import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext<any>(null);

const STORAGE_KEY = "wishlist";

export const WishlistProvider = ({ children }: any) => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);

      if (data) {
        setWishlist(JSON.parse(data));
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const saveWishlist = async (items: any[]) => {
    setWishlist(items);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const isFavourite = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const toggleWishlist = async (product: any) => {
    let updated = [];

    if (isFavourite(product.id)) {
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }

    await saveWishlist(updated);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        isFavourite,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
