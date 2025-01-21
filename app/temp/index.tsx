import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

const Index = () => {
    return (
        <View>
            <Text>just a temp page</Text>
            <Link href="/temp/tempComponent">
                <Text>go to temp component11</Text>
                <Text>go to temp component11</Text>
                <Text>go to temp component11</Text>
                <Text>go to temp component11</Text>
            </Link>
            <Link href="/components/someComs">
                <Text>go to some coms</Text>
            </Link>
        </View>
    );
};

export default Index;