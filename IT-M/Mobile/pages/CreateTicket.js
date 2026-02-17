import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import api from "./api";

const priorities = [
  { label: "Korkea", value: "KORKEA" },
  { label: "Keskitaso", value: "KESKITASO" },
  { label: "Matala", value: "MATALA" },
];

const priorityColors = {
  KORKEA: "#ef4444",
  KESKITASO: "#f59e0b",
  MATALA: "#10b981",
};

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("KESKITASO");
  const [submitting, setSubmitting] = useState(false);

  const submitTicket = async () => {
    if (!title || !description) {
      Alert.alert("Virhe", "Täytä otsikko ja kuvaus");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/tickets/createtickets", {
        title,
        description,
        priority,
      });
      setTitle("");
      setDescription("");
      setPriority("KESKITASO");
      Alert.alert("Onnistui", "Tiketti luotu onnistuneesti");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Tiketin luonti epäonnistui";
      Alert.alert("Virhe", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Luo tiketti</Text>

      <Text style={styles.label}>Otsikko</Text>
      <TextInput
        style={styles.input}
        placeholder="Tiketin otsikko"
        placeholderTextColor="#94a3b8"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Kuvaus</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Kuvaa ongelma"
        placeholderTextColor="#94a3b8"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Prioriteetti</Text>
      <View style={styles.priorityRow}>
        {priorities.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={
              item.value === priority
                ? [
                    styles.priorityButton,
                    styles.priorityButtonActive,
                    { backgroundColor: priorityColors[item.value] },
                  ]
                : [
                    styles.priorityButton,
                    styles.priorityButtonInactive,
                    { backgroundColor: priorityColors[item.value] },
                  ]
            }
            onPress={() => setPriority(item.value)}
          >
            <Text
              style={
                item.value === priority
                  ? styles.priorityButtonTextActive
                  : styles.priorityButtonText
              }
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={submitTicket}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? "Lähetetään..." : "Lähetä"}
        </Text>
      </TouchableOpacity>
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
    flexGrow: 1,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 16,
  },
  label: {
    color: "#e2e8f0",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#111827",
    color: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  priorityRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  priorityButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  priorityButtonActive: {
    borderWidth: 1,
    borderColor: "#f8fafc",
  },
  priorityButtonInactive: {
    opacity: 0.6,
  },
  priorityButtonText: {
    color: "#0b1120",
    fontWeight: "600",
  },
  priorityButtonTextActive: {
    color: "#0b1120",
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "700",
  },
});
