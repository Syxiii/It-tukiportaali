import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import api from "./api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/getusers");
      setUsers(res.data || []);
    } catch (error) {
      Alert.alert("Error", "User fetch failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addNewUser = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password });
      setName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
      await fetchUsers();
      Alert.alert("Success", "User created");
    } catch (error) {
      const message = error?.response?.data?.message || "User create failed";
      Alert.alert("Error", message);
    }
  };

  const confirmDeleteUser = (id) => {
    Alert.alert("Confirm", "Delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteUser(id),
      },
    ]);
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/auth/deleteuser/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      Alert.alert("Error", "User delete failed");
    }
  };

  const toggleAdminStatus = async (id) => {
    try {
      await api.put(`/auth/toggleadmin/${id}`, { userId: id });
      await fetchUsers();
    } catch (error) {
      Alert.alert("Error", "Admin toggle failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User management</Text>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowForm((prev) => !prev)}
      >
        <Text style={styles.toggleButtonText}>
          {showForm ? "Cancel" : "+ Add user"}
        </Text>
      </TouchableOpacity>

      {showForm ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.primaryButton} onPress={addNewUser}>
            <Text style={styles.primaryButtonText}>Create user</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userRole}>
                {item.role === "ADMIN" ? "Admin" : "User"}
              </Text>
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleAdminStatus(item.id)}
              >
                <Text style={styles.actionButtonText}>
                  {item.role === "ADMIN" ? "Remove admin" : "Make admin"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => confirmDeleteUser(item.id)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "600",
  },
  form: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#f8fafc",
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
  list: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    color: "#f8fafc",
    fontWeight: "600",
    fontSize: 16,
  },
  userRole: {
    color: "#94a3b8",
  },
  userActions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actionButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#b91c1c",
  },
});
