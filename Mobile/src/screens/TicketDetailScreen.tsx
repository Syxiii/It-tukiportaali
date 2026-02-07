import { View, Text } from "react-native";

export default function TicketDetailScreen({ route }: any) {
  const { ticket } = route.params;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {ticket.title}
      </Text>
      <Text>{ticket.description}</Text>
      <Text>Tila: {ticket.status}</Text>
    </View>
  );
}
