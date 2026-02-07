import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen({ navigation }: any) {
  const { saveToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await saveToken("FAKE_TOKEN");
    navigation.replace("Tickets");
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>IT-tukiportaali</Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Kirjaudu" onPress={handleLogin} />
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
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
});
