import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const tabs = [
  {
    id: "password",
    title: "How do I change my password?",
    summary: "Change it from your profile settings.",
  },
  {
    id: "login",
    title: "I cannot log in",
    summary: "Check credentials or reset your password.",
  },
  {
    id: "locked",
    title: "My account is locked",
    summary: "Too many failed attempts can lock the account.",
  },
  {
    id: "verification",
    title: "Why did I get a verification request?",
    summary: "We notify when a login is detected on a new device.",
  },
  {
    id: "security",
    title: "How is my data protected?",
    summary: "We use strong encryption and logging policies.",
  },
];

const passwordSteps = [
  "Log in with your current credentials.",
  "Open the profile menu.",
  "Choose Settings, then Change password.",
  "Enter your current password and create a new one.",
  "Confirm and save.",
  "Log in again if prompted.",
];

const securityTips = [
  {
    title: "Strong password",
    text: "Use at least 12 characters with mixed cases, numbers, and symbols.",
  },
  {
    title: "Avoid reuse",
    text: "Do not reuse passwords across services.",
  },
  {
    title: "Phishing awareness",
    text: "Avoid suspicious links and verify sender addresses.",
  },
  {
    title: "Device lock",
    text: "Use automatic lock and update your OS regularly.",
  },
  {
    title: "Notifications",
    text: "If you receive a suspicious login alert, change password immediately.",
  },
  {
    title: "Data handling",
    text: "Support tickets are handled confidentially by authorized staff only.",
  },
];

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeItem = tabs.find((item) => item.id === activeTab);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>FAQ</Text>
      <Text style={styles.subtitle}>Security and support guidance</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security tips</Text>
        {securityTips.map((tip) => (
          <View key={tip.title} style={styles.card}>
            <Text style={styles.cardTitle}>{tip.title}</Text>
            <Text style={styles.cardText}>{tip.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common questions</Text>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={
              activeTab === tab.id
                ? [styles.tabButton, styles.tabButtonActive]
                : styles.tabButton
            }
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabTitle}>{tab.title}</Text>
            <Text style={styles.tabSummary}>{tab.summary}</Text>
          </TouchableOpacity>
        ))}

        {activeItem ? (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{activeItem.title}</Text>
            <Text style={styles.panelText}>{activeItem.summary}</Text>
            {activeTab === "login" ? (
              <View style={styles.panelList}>
                <Text style={styles.panelItem}>1. Make sure Caps Lock is off.</Text>
                <Text style={styles.panelItem}>2. Try a password reset.</Text>
                <Text style={styles.panelItem}>3. Contact support if it continues.</Text>
              </View>
            ) : null}
            {activeTab === "password" ? (
              <View style={styles.panelList}>
                {passwordSteps.map((step, index) => (
                  <Text key={step} style={styles.panelItem}>
                    {index + 1}. {step}
                  </Text>
                ))}
              </View>
            ) : null}
            {activeTab === "locked" ? (
              <View style={styles.panelList}>
                <Text style={styles.panelItem}>1. Wait 10 minutes before retrying.</Text>
                <Text style={styles.panelItem}>2. Ask admin to unlock if needed.</Text>
                <Text style={styles.panelItem}>3. Double-check your username.</Text>
              </View>
            ) : null}
            {activeTab === "verification" ? (
              <View style={styles.panelList}>
                <Text style={styles.panelItem}>1. Approve only if it was you.</Text>
                <Text style={styles.panelItem}>2. Reject and change password if not.</Text>
                <Text style={styles.panelItem}>3. Inform support for follow-up.</Text>
              </View>
            ) : null}
            {activeTab === "security" ? (
              <View style={styles.panelList}>
                <Text style={styles.panelItem}>1. Sessions are logged and monitored.</Text>
                <Text style={styles.panelItem}>2. Access is restricted to staff.</Text>
                <Text style={styles.panelItem}>3. Redundancy ensures continuity.</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    marginBottom: 4,
  },
  cardText: {
    color: "#94a3b8",
  },
  tabButton: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  tabButtonActive: {
    borderColor: "#2563eb",
    borderWidth: 1,
  },
  tabTitle: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  tabSummary: {
    color: "#94a3b8",
    marginTop: 4,
  },
  panel: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
  },
  panelTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    marginBottom: 6,
  },
  panelText: {
    color: "#94a3b8",
    marginBottom: 6,
  },
  panelList: {
    marginTop: 6,
  },
  panelItem: {
    color: "#e2e8f0",
    marginBottom: 4,
  },
});
