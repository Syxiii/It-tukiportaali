import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function Welcome({ navigation, currentUser, onLogout }) {
  const displayName = currentUser?.name || currentUser?.email || "";
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>IT-tukipalvelu</Text>
        <Text style={styles.subtitle}>Tervetuloa {displayName}</Text>
        <Text style={styles.heroText}>
          Luo tiketti tai seuraa nykyisten pyyntöjen tilaa.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Pikalinkit</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Luo uusi tiketti</Text>
        <Text style={styles.cardText}>
          Lähetä uusi tukipyyntö, jossa on tiedot ja prioriteetti.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Create")}
        >
          <Text style={styles.primaryButtonText}>Luo tiketti</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Omat tiketit</Text>
        <Text style={styles.cardText}>
          Seuraa pyyntöjäsi ja lisää kommentteja.
        </Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Tickets")}
        >
          <Text style={styles.secondaryButtonText}>Avaa omat tiketit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>FAQ</Text>
        <Text style={styles.cardText}>
          Nopeat vastaukset yleisiin ongelmiin ja tietoturvaohjeisiin.
        </Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("FAQ")}
        >
          <Text style={styles.secondaryButtonText}>Avaa FAQ</Text>
        </TouchableOpacity>
      </View>

      {isAdmin ? (
        <>
          <Text style={styles.sectionTitle}>Yllapito</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ylläpito</Text>
          <Text style={styles.cardText}>
            Hallitse tiketteja ja käyttäjiä.
          </Text>
          <View style={styles.adminRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Hallintapaneeli")}
            >
              <Text style={styles.secondaryButtonText}>Hallintapaneeli</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Käyttäjät")}
            >
              <Text style={styles.secondaryButtonText}>Käyttäjät</Text>
            </TouchableOpacity>
          </View>
        </View>
        </>
      ) : null}
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
    fontSize: 16,
    color: "#cbd5f5",
    marginBottom: 18,
  },
  heroText: {
    fontSize: 13,
    color: "#94a3b8",
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
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f8fafc",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#d1d5db",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  secondaryButtonText: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  adminRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
