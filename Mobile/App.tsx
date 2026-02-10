import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
// debug: log core imports to help trace runtime undefined errors
console.log('NavigationContainer:', NavigationContainer);
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./src/hooks/useAuth";
import RootNavigator from "./src/navigation/RootNavigator";

const queryClient = new QueryClient();

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
