import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';
import { setAuthToken } from './pages/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [restoring, setRestoring] = useState(true);
  const [language, setLanguage] = useState("fi");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        const storedLanguage = await AsyncStorage.getItem("language");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setAuthToken(storedToken);
          setToken(storedToken);
          setCurrentUser(parsedUser);
        }

        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error("Virhe käyttäjän tietojen latauksessa:", error);
      } finally {
        setRestoring(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogin = async (newToken, user) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setAuthToken(newToken);
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
      setAuthToken("");
      setToken("");
      setCurrentUser(null);
    } catch (error) {
      console.error("Virhe käyttäjän tietojen poistossa:", error);
    }
  };

  const handleLanguageChange = async (lang) => {
    try {
      await AsyncStorage.setItem("language", lang);
      setLanguage(lang);
    } catch (error) {
      console.error("Virhe kielen tallennuksessa:", error);
    }
  };

  if (restoring) {
    return (
      <View style={styles.restoreContainer}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={styles.restoreText}>Ladataan istuntoa...</Text>
      </View>
    );
  }

  return (
    <AppNavigator
      onLogin={handleLogin}
      onLogout={handleLogout}
      onLanguageChange={handleLanguageChange}
      currentUser={currentUser}
      token={token}
      language={language}
    />
  );
}

const styles = StyleSheet.create({
  restoreContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  restoreText: {
    color: "#94a3b8",
    marginTop: 10,
  },
});

