import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function Welcome({ navigation, currentUser, onLogout }) {
  const displayName = currentUser?.name || currentUser?.email || "";
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>IT Support Portal</Text>
      <Text style={styles.subtitle}>Welcome {displayName}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create a new ticket</Text>
        <Text style={styles.cardText}>
          Submit a new support request with details and priority.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("CreateTicket")}
        >
          <Text style={styles.primaryButtonText}>Create ticket</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My tickets</Text>
        <Text style={styles.cardText}>
          Track your requests and add comments.
        </Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("MyTickets")}
        >
          <Text style={styles.secondaryButtonText}>Open my tickets</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>FAQ</Text>
        <Text style={styles.cardText}>
          Quick answers for common issues and security guidance.
        </Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("FAQ")}
        >
          <Text style={styles.secondaryButtonText}>Open FAQ</Text>
        </TouchableOpacity>
      </View>

      {isAdmin ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin tools</Text>
          <Text style={styles.cardText}>
            Manage tickets and users.
          </Text>
          <View style={styles.adminRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("AdminDashboard")}
            >
              <Text style={styles.secondaryButtonText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("UserManagement")}
            >
              <Text style={styles.secondaryButtonText}>Users</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Log out</Text>
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
