import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/Login";
import Welcome from "../pages/Welcome";
import MyTickets from "../pages/MyTickets";
import CreateTicket from "../pages/CreateTicket";
import AdminDashboard from "../pages/AdminDashboard";
import UserManagement from "../pages/UserManagement";
import FAQ from "../pages/FAQ";

const Stack = createStackNavigator();

export default function AppNavigator({ onLogin, onLogout, currentUser, token }) {
  const isLoggedIn = Boolean(token);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome">
            {(props) => (
              <Welcome
                {...props}
                currentUser={currentUser}
                onLogout={onLogout}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="MyTickets" component={MyTickets} />
          <Stack.Screen name="CreateTicket" component={CreateTicket} />
          <Stack.Screen name="FAQ" component={FAQ} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="UserManagement" component={UserManagement} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login">
            {(props) => <Login {...props} onLogin={onLogin} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
