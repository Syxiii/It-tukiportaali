import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context";
import Login from "../pages/Login";
import Welcome from "../pages/Welcome";
import MyTickets from "../pages/MyTickets";
import CreateTicket from "../pages/CreateTicket";
import AdminDashboard from "../pages/AdminDashboard";
import UserManagement from "../pages/UserManagement";
import FAQ from "../pages/FAQ";
import Settings from "../pages/Settings";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs({ currentUser, onLogout, onLanguageChange, language }) {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + tabBarBottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0b1220",
          borderTopColor: "#1f2937",
          height: tabBarHeight,
          paddingBottom: tabBarBottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#60a5fa",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <Welcome
            {...props}
            currentUser={currentUser}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Tiketit" component={MyTickets} />
      <Tab.Screen name="Luo tiketti" component={CreateTicket} />
      <Tab.Screen name="FAQ" component={FAQ} />
      <Tab.Screen name="Asetukset">
        {(props) => (
          <Settings
            {...props}
            currentUser={currentUser}
            onLogout={onLogout}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function AdminTabs({ currentUser, onLogout, onLanguageChange, language }) {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + tabBarBottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0b1220",
          borderTopColor: "#1f2937",
          height: tabBarHeight,
          paddingBottom: tabBarBottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#60a5fa",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <Welcome
            {...props}
            currentUser={currentUser}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
        <Tab.Screen
          name="Tickets"
          component={MyTickets}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: "none" },
          }}
        />
        <Tab.Screen
          name="Create"
          component={CreateTicket}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: "none" },
          }}
        />
      <Tab.Screen name="Hallintapaneeli" component={AdminDashboard} />
      <Tab.Screen name="Käyttäjät" component={UserManagement} />
      <Tab.Screen name="FAQ" component={FAQ} />
      <Tab.Screen name="Asetukset">
        {(props) => (
          <Settings
            {...props}
            currentUser={currentUser}
            onLogout={onLogout}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator({ onLogin, onLogout, onLanguageChange, currentUser, token, language }) {
  const isLoggedIn = Boolean(token);
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          isAdmin ? (
            <AdminTabs
              currentUser={currentUser}
              onLogout={onLogout}
              onLanguageChange={onLanguageChange}
              language={language}
            />
          ) : (
            <UserTabs
              currentUser={currentUser}
              onLogout={onLogout}
              onLanguageChange={onLanguageChange}
              language={language}
            />
          )
        ) : (
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login">
              {(props) => <Login {...props} onLogin={onLogin} />}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
