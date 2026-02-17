import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { login } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { saveToken } = useAuth();

  const handleLogin = async () => {
    setError("");
    try {
      const data = await login(email, password);
      await saveToken(data.token);
      navigation.navigate("Tickets");
    } catch (err) {
      setError("Virhe kirjautumisessa. Tarkista tunnukset.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IT-tukiportaali</Text>

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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Kirjaudu sisään" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
