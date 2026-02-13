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
  { label: "High", value: "KORKEA" },
  { label: "Medium", value: "KESKITASO" },
  { label: "Low", value: "MATALA" },
];

export default function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("KESKITASO");
  const [submitting, setSubmitting] = useState(false);

  const submitTicket = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill title and description");
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
      Alert.alert("Success", "Ticket created successfully");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Ticket creation failed";
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create ticket</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Ticket title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Describe the issue"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {priorities.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={
              item.value === priority
                ? [styles.priorityButton, styles.priorityButtonActive]
                : styles.priorityButton
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
          {submitting ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0f172a",
    flexGrow: 1,
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
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  priorityButtonActive: {
    backgroundColor: "#2563eb",
  },
  priorityButtonText: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  priorityButtonTextActive: {
    color: "white",
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
