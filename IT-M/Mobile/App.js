import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Virhe käyttäjän tietojen latauksessa:", error);
      }
    };

    loadUserData();
  }, []);

  const handleLogin = async (newToken, user) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setToken(newToken);
      setCurrentUser(user);
    } catch (error) {
      console.error("Virhe käyttäjän tietojen tallennuksessa:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setToken("");
      setCurrentUser(null);
    } catch (error) {
      console.error("Virhe käyttäjän tietojen poistossa:", error);
    }
  };

  return <AppNavigator onLogin={handleLogin} />;
}

