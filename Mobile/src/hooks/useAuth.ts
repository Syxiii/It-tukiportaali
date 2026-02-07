import { useEffect, useState } from "react";
import * as Storage from "../utils/storage";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await Storage.getItem("token");
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkToken();
  }, []);

  const saveToken = async (token: string) => {
    await Storage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await Storage.deleteItem("token");
    setIsLoggedIn(false);
  };

  return { loading, isLoggedIn, saveToken, logout };
}
