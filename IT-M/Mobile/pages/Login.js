import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "./api";

const Login = ({ navigation, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      onLogin(response.data.token, response.data.user);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Kirjautuminen epäonnistui";
      Alert.alert("Virhe", message);
    }
  };

  const handleRegister = async () => {
    if (!email || !name || !password || !confirmPassword) {
      Alert.alert("Virhe", "Täytä kaikki kentät");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Virhe", "Salasanat eivät täsmää");
      return;
    }

    try {
      await api.post("/auth/register", {
        email,
        name,
        password,
      });

      Alert.alert("Onnistui", "Käyttäjä luotu. Kirjaudu sisään.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsLoginMode(true);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Rekisterointi epäonnistui";
      Alert.alert("Virhe", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IT Support</Text>

      {isLoginMode ? (
        <>
          <Text style={styles.subtitle}>Kirjaudu sisään</Text>
          <TextInput
            style={styles.input}
            placeholder="Sähköposti"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Salasana"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Kirjaudu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setIsLoginMode(false)}
          >
            <Text style={styles.linkText}>Luo uusi käyttäjä</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Luo uusi käyttäjä</Text>
          <TextInput
            style={styles.input}
            placeholder="Sähköposti"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Nimi"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Salasana"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Vahvista salasana"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Luo käyttäjä</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setIsLoginMode(true)}
          >
            <Text style={styles.linkText}>Kirjaudu sisään</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 8,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 12,
  },
  linkText: {
    color: "#93c5fd",
  },
});

export default Login;
