import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";

export default function Settings({ currentUser, onLogout, language, onLanguageChange }) {
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    onLanguageChange(lang);
    Alert.alert("Onnistui", `Kieli vaihdettu: ${lang === "fi" ? "Suomi" : "English"}`);
  };

  const handleLogout = () => {
    Alert.alert("Vahvista", "Haluatko varmasti kirjautua ulos?", [
      { text: "Peruuta", style: "cancel" },
      {
        text: "Kirjaudu ulos",
        style: "destructive",
        onPress: onLogout,
      },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Asetukset</Text>
        <Text style={styles.subtitle}>{currentUser?.name || currentUser?.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Kieli</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === "fi" && styles.languageButtonActive,
          ]}
          onPress={() => handleLanguageChange("fi")}
        >
          <Text
            style={[
              styles.languageButtonText,
              selectedLanguage === "fi" && styles.languageButtonTextActive,
            ]}
          >
            🇫🇮 Suomi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === "en" && styles.languageButtonActive,
          ]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text
            style={[
              styles.languageButtonText,
              selectedLanguage === "en" && styles.languageButtonTextActive,
            ]}
          >
            🇬🇧 English
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Tili</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nimi:</Text>
          <Text style={styles.infoValue}>{currentUser?.name || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sähköposti:</Text>
          <Text style={styles.infoValue}>{currentUser?.email || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rooli:</Text>
          <Text style={styles.infoValue}>
            {currentUser?.role === "ADMIN" ? "Ylläpitäjä" : "Käyttäjä"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Turvallisuus</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    padding: 20,
    backgroundColor: "#0f172a",
    paddingTop: 32,
  },
  hero: {
    backgroundColor: "#0b1220",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5f5",
  },
  sectionTitle: {
    color: "#cbd5f5",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  languageButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  languageButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#60a5fa",
  },
  languageButtonText: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: 16,
  },
  languageButtonTextActive: {
    color: "white",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  infoLabel: {
    color: "#94a3b8",
    fontWeight: "600",
  },
  infoValue: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#b91c1c",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
