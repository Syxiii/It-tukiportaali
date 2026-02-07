import { View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../api/tickets";
import { useAuth } from "../hooks/useAuth";

export default function TicketListScreen({ navigation }: any) {

  const { logout } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  if (isLoading) {
    return <Text>Ladataan tikettejä...</Text>;
  }

  return (
    <>
      {/* Logout-nappi */}
      <Button title="Kirjaudu ulos" onPress={logout} />

      <FlatList
        data={data}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TicketDetail", { ticket: item })
            }
          >
            <View style={{ padding: 15, borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
              <Text>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  );
}
