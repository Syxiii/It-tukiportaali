import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMyTickets } from "../api/tickets";
import { useAuth } from "../hooks/useAuth";

export default function TicketListScreen({ navigation }: any) {
  const { logout } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["myTickets"],
    queryFn: getMyTickets,
  });

  if (isLoading) {
    return <Text style={styles.center}>Ladataan tikettejä...</Text>;
  }

  if (error) {
    return <Text style={styles.center}>Virhe tikettien haussa</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Kirjaudu ulos" onPress={logout} />

      <FlatList
        data={data}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TicketDetail", { ticket: item })
            }
          >
            <View style={styles.ticket}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>Tila: {item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    textAlign: "center",
    marginTop: 20,
  },
  ticket: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
