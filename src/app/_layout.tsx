import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Import global CSS
import "../../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import RootStore from "@/store/rootStore";
import { StoreContext } from "@/store/context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export { StoreContext };
const rootStore = new RootStore();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StoreContext.Provider value={rootStore}>
                <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                    <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false, animation: "none" }} />
                        <Stack.Screen name="welcome" options={{ headerShown: false, animation: "none" }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none" }} />
                        <Stack.Screen name="temp" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
                </ThemeProvider>
            </StoreContext.Provider>
        </GestureHandlerRootView>
    );
}
