import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: true,
                tabBarButton: HapticTab,
                tabBarBackground: () => (
                    <LinearGradient
                        // colors={["#A3C8FF", "#E0E4FF"]}
                        colors={["#E0E4FF", "#A3C8FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1 }}
                    />
                ),
                // tabBarStyle: Platform.select({
                //     ios: {
                //         // Use a transparent background on iOS to show the blur effect
                //         position: "absolute",
                //         backgroundColor: "transparent",
                //     },
                //     default: {},
                // }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: "OSC",
                    tabBarActiveTintColor: "#80C7FF",
                    // tabBarShowLabel: false,
                    // tabBarLabelStyle: { color: "#333333", },
                    // tabBarStyle: { backgroundColor: "red" },
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol size={28} name="house.fill" color={focused ? "#80C7FF" : color} />
                    ),
                    tabBarStyle: { backgroundColor: "transparent" },
                    // // tabBarActiveBackgroundColor: "red",
                }}
            />
            <Tabs.Screen
                name="translate"
                // redirect={true}
                options={{
                    title: "翻译",
                    tabBarActiveTintColor: "#80C7FF",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol size={28} name="paperplane.fill" color={focused ? "#80C7FF" : color} />
                    ),
                    tabBarStyle: { backgroundColor: "transparent" },
                    // tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="setting"
                // redirect={true}
                options={{
                    title: "设置",
                    tabBarActiveTintColor: "#80C7FF",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol size={28} name="paperplane.fill" color={focused ? "#80C7FF" : color} />
                    ),
                    tabBarStyle: { backgroundColor: "transparent" },
                    // tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}
