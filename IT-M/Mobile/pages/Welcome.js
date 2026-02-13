import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function Welcome({ navigation, currentUser, onLogout }) {
  const displayName = currentUser?.name || currentUser?.email || "";
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>IT-tukipalvelu</Text>
      <Text style={styles.subtitle}>Tervetuloa {displayName}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Luo uusi tiketti</Text>
        <Text style={styles.cardText}>
          Lähetä uusi tukipyyntö, jossa on tiedot ja prioriteetti.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("CreateTicket")}
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
          onPress={() => navigation.navigate("MyTickets")}
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ylläpito</Text>
          <Text style={styles.cardText}>
            Hallitse tiketteja ja käyttäjiä.
          </Text>
          <View style={styles.adminRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("AdminDashboard")}
            >
              <Text style={styles.secondaryButtonText}>Hallintapaneeli</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("UserManagement")}
            >
              <Text style={styles.secondaryButtonText}>Käyttäjät</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Kirjaudu ulos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0f172a",
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
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  },
  logoutButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 10,
  },
  logoutText: {
    color: "#f87171",
    fontWeight: "600",
  },
});
