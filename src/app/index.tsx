import { Redirect } from "expo-router";
import { storage } from "@/store/mmkv";

export default function Index() {
    const hasSeenWelcome = storage.getBoolean("hasSeenWelcome") ?? false;

    if (!hasSeenWelcome) {
        return <Redirect href="/welcome" />;
    }

    return <Redirect href="/(tabs)" />;
}