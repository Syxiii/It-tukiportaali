import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { useAuth } from "./hooks/useAuth";
import LoginScreen from "./screens/LoginScreen";

export default function App() {
  const { loading, isLoggedIn } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoggedIn ? <View /> : <LoginScreen />}
    </SafeAreaView>
  );
}
