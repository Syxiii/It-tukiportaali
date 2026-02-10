import { createNativeStackNavigator } from "@react-navigation/native-stack";
// debug: log native stack creator
console.log('createNativeStackNavigator:', createNativeStackNavigator);
import LoginScreen from "../screens/LoginScreen";
import TicketListScreen from "../screens/TicketListScreen";
import TicketDetailScreen from "../screens/TicketDetailScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tickets"
        component={TicketListScreen}
        options={{ title: "Tiketit" }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{ title: "Tiketin tiedot" }}
      />
    </Stack.Navigator>
  );
}
