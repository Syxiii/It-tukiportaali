import { View, TextInput, Button } from "react-native";
import { useState } from "react";
import { api } from "../api/client";

export default function CreateTicketScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createTicket = async () => {
    await api.post("/tickets", { title, description });
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Otsikko" onChangeText={setTitle} />
      <TextInput placeholder="Kuvaus" onChangeText={setDescription} />
      <Button title="Luo tiketti" onPress={createTicket} />
    </View>
  );
}
