import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createContext, useEffect } from "react";
import "react-native-reanimated";
import { Slot } from "expo-router";
import * as Linking from "expo-linking";

// Import your global CSS file
import "../../global.css";
import "../../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import RootStore from "@/store/rootStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export const StoreContext = createContext<RootStore | null>(null);
const rootStore = new RootStore();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const [loaded] = useFonts({
        SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // 全局处理 Deep Link
    useEffect(() => {
        // 处理初始链接（app 未打开时）
        const getInitialURL = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                console.log("通过 Deep Link 启动:", initialUrl);
                handleDeepLink(initialUrl);
            }
        };

        // 处理 Deep Link
        const handleDeepLink = (url: string) => {
            const { path, queryParams } = Linking.parse(url);
            console.log("Deep Link - path:", path);
            console.log("Deep Link - queryParams:", queryParams);

            // 根据路径导航到对应页面
            if (path === "temp" || path === "temp/") {
                // 将参数传递给 temp 页面
                const params = new URLSearchParams(queryParams as any).toString();
                router.push(`/temp${params ? `?${params}` : ""}` as any);
            }
            // 可以添加其他路径的处理
        };

        getInitialURL();

        // 监听新的 Deep Link（app 已打开时）
        const subscription = Linking.addEventListener("url", (event) => {
            console.log("收到新的 Deep Link:", event.url);
            handleDeepLink(event.url);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <StoreContext.Provider value={rootStore}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="index" redirect />
                    <Stack.Screen name="welcome" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </StoreContext.Provider>
    );
}
