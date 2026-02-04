import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkToken();
  }, []);

  const saveToken = async (token: string) => {
    await SecureStore.setItemAsync("token", token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setIsLoggedIn(false);
  };

  return { loading, isLoggedIn, saveToken, logout };
}
