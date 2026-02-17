import React, { useEffect, useRef, useState, createContext } from 'react';
import { ActivityIndicator, AppState, Platform, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import AppNavigator from './navigation/AppNavigator';
import { setAuthToken } from './pages/api';
import api from './pages/api';
import messaging from '@react-native-firebase/messaging';


export const LanguageContext = createContext();

const LOGOUT_DELAY_MS = 5 * 60 * 1000;
const LOGOUT_AT_KEY = 'logoutAt';
const LOGOUT_TRIGGER_ID_KEY = 'logoutTriggerId';
const LOGOUT_WARNING_ID = 'logout-warning';
const LOGOUT_COMPLETE_ID = 'logout-complete';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [restoring, setRestoring] = useState(true);
  const [language, setLanguage] = useState("fi");
  const tokenRef = useRef(token);
  const channelIdRef = useRef(null);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        const storedLanguage = await AsyncStorage.getItem("language");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setAuthToken(storedToken);
          setToken(storedToken);
          setCurrentUser(parsedUser);
        }

        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error("Virhe käyttäjän tietojen latauksessa:", error);
      } finally {
        setRestoring(false);
      }
    };

    loadUserData();
  }, []);


  useEffect(() => {
    const getFcmToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const fcmToken = await messaging().getToken();
        console.log("FCM TOKEN:", fcmToken);

        // Lähetä tämä backendille
      }
    };

    getFcmToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
      if (token) {
        await api.post(
          "/tickets/saveFcmToken",
          { fcmToken },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    });

    return unsubscribe;
  }, [token]);


  useEffect(() => {
    const initializeNotifications = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      await notifee.requestPermission();

      if (!channelIdRef.current) {
        channelIdRef.current = await notifee.createChannel({
          id: 'security',
          name: 'Security',
          importance: AndroidImportance.HIGH,
        });
      }

      await reconcileLogoutOnLaunch();
    };

    initializeNotifications();

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const ensureNotificationChannel = async () => {
    if (channelIdRef.current) {
      return channelIdRef.current;
    }

    const channelId = await notifee.createChannel({
      id: 'security',
      name: 'Security',
      importance: AndroidImportance.HIGH,
    });
    channelIdRef.current = channelId;
    return channelId;
  };

  const clearPendingLogout = async ({ keepCompleteNotification = false } = {}) => {
    if (Platform.OS !== 'android') {
      await AsyncStorage.multiRemove([LOGOUT_AT_KEY, LOGOUT_TRIGGER_ID_KEY]);
      return;
    }

    const triggerId = await AsyncStorage.getItem(LOGOUT_TRIGGER_ID_KEY);
    if (triggerId) {
      await notifee.cancelTriggerNotification(triggerId);
    }

    await notifee.cancelNotification(LOGOUT_WARNING_ID);
    if (!keepCompleteNotification) {
      await notifee.cancelNotification(LOGOUT_COMPLETE_ID);
    }

    await AsyncStorage.multiRemove([LOGOUT_AT_KEY, LOGOUT_TRIGGER_ID_KEY]);
  };

  const displayLogoutCompleteNotification = async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    const channelId = await ensureNotificationChannel();
    await notifee.displayNotification({
      id: LOGOUT_COMPLETE_ID,
      title: 'Kirjauduttu ulos',
      body: 'Olet kirjattu ulos turvallisuussyista.',
      android: {
        channelId,
        smallIcon: 'ic_launcher',
      },
    });
  };

  const scheduleLogoutNotifications = async () => {
    if (!tokenRef.current || Platform.OS !== 'android') {
      return;
    }

    await clearPendingLogout();
    const channelId = await ensureNotificationChannel();
    const logoutAt = Date.now() + LOGOUT_DELAY_MS;

    await notifee.displayNotification({
      id: LOGOUT_WARNING_ID,
      title: 'Istunto päättyy pian',
      body: 'Sinut kirjataan ulos 5 minuutin kuluttua.',
      android: {
        channelId,
        smallIcon: 'ic_launcher',
      },
    });

    const triggerId = await notifee.createTriggerNotification(
      {
        id: LOGOUT_COMPLETE_ID,
        title: 'Kirjauduttu ulos',
        body: 'Olet kirjattu ulos turvallisuussyista.',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: logoutAt,
        alarmManager: { allowWhileIdle: true },
      }
    );

    await AsyncStorage.multiSet([
      [LOGOUT_AT_KEY, logoutAt.toString()],
      [LOGOUT_TRIGGER_ID_KEY, triggerId],
    ]);
  };

  const reconcileLogoutOnLaunch = async () => {
    const logoutAtRaw = await AsyncStorage.getItem(LOGOUT_AT_KEY);
    if (!logoutAtRaw) {
      return;
    }

    const logoutAt = Number(logoutAtRaw);
    if (!Number.isFinite(logoutAt)) {
      await clearPendingLogout();
      return;
    }

    if (Date.now() >= logoutAt) {
      await displayLogoutCompleteNotification();
      await handleLogout({ keepCompleteNotification: true });
      return;
    }

    await clearPendingLogout();
  };

  const handleAppStateChange = async (nextState) => {
    if (nextState === 'active') {
      await reconcileLogoutOnLaunch();
      return;
    }

    if (nextState === 'background' || nextState === 'inactive') {
      await scheduleLogoutNotifications();
    }
  };

  const handleLogin = async (newToken, user) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      await clearPendingLogout();

      setAuthToken(newToken);
      setToken(newToken);
      setCurrentUser(user);

    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      await api.post("/tickets/saveFcmToken", // backend endpoint
        { fcmToken },            // body
        {
          headers: {
            Authorization: `Bearer ${newToken}`, // token header
            "Content-Type": "application/json",
          },
        }
      );
    }

    } catch (error) {
      console.error("Virhe käyttäjän tietojen tallennuksessa:", error);
    }
  };

  const handleLogout = async ({ keepCompleteNotification = false } = {}) => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await clearPendingLogout({ keepCompleteNotification });
      setAuthToken("");
      setToken("");
      setCurrentUser(null);
    } catch (error) {
      console.error("Virhe käyttäjän tietojen poistossa:", error);
    }
  };

  const handleLanguageChange = async (lang) => {
    try {
      await AsyncStorage.setItem("language", lang);
      setLanguage(lang);
    } catch (error) {
      console.error("Virhe kielen tallennuksessa:", error);
    }
  };

  if (restoring) {
    return (
      <View style={styles.restoreContainer}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={styles.restoreText}>Ladataan istuntoa...</Text>
      </View>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      <AppNavigator
        onLogin={handleLogin}
        onLogout={handleLogout}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        token={token}
        language={language}
      />
    </LanguageContext.Provider>
  );
}

const styles = StyleSheet.create({
  restoreContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  restoreText: {
    color: "#94a3b8",
    marginTop: 10,
  },
});

