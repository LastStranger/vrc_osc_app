import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/*<SafeAreaView style={{ flex: 1 }}>*/}
                <Stack screenOptions={{ headerShown: false }} />
            {/*</SafeAreaView>*/}
        </GestureHandlerRootView>
    );
}
