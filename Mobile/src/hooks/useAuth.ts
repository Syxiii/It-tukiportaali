import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      setIsLoggedIn(!!token);
      setLoading(false);
    });
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
