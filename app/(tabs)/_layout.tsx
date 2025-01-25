import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BlurView } from "expo-blur";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: true,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: "absolute",
                        backgroundColor: "transparent",
                    },
                    default: {}
                })
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    // title: 'Home',
                    //   headerTransparent: true,
                    // headerBackground: () => (
                    //     <BlurView intensity={50} style={{ flex: 1 }} />
                    // ),            // headerBackgroundContainerStyle: {backgroundColor: "transparent"},
                    // headerStyle: {backgroundColor: "transparent"},
                    // headerBackgroundContainerStyle: {backgroundColor: "transparent"},
                    // headerTintColor: "red",
                    // headerBackground: () => "red",
                    // headerTitleStyle: {backgroundColor: "red"},
                    // tabBarActiveBackgroundColor: "red",
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    tabBarStyle: { backgroundColor: "transparent" },
                    // tabBarActiveBackgroundColor: "red",
                }}
            />
            <Tabs.Screen
                name="explore"
                redirect={true}
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />
                }}
            />
        </Tabs>
    );
}
