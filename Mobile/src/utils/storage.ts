import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  }
  return await SecureStore.getItemAsync(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.reject(new Error("Failed to set item in localStorage"));
    }
  }
  return await SecureStore.setItemAsync(key, value);
}

export async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch {
      return Promise.reject(new Error("Failed to remove item from localStorage"));
    }
  }
  return await SecureStore.deleteItemAsync(key);
}
