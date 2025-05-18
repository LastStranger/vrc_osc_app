import React, { useEffect } from "react";
import { View, Text } from "react-native";
import * as Linking from 'expo-linking';


const Index = () => {


    useEffect(() => {
        console.log("useEffect");

        // 处理初始链接
        const getInitialURL = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                console.warn(initialUrl, "initialUrl");
                handleDeepLink({ url: initialUrl });
            }
        };

        // 处理新的深度链接
        const handleDeepLink = (event: any) => {
            const url = event.url;
            const { path, queryParams } = Linking.parse(url);

            console.warn(path, "path");
            console.warn(queryParams, "queryParams");

            if (path === 'temp') {
                console.warn("hahahaha");
            }
        };

        getInitialURL(); // 检查初始链接
        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, []);


    return (
        <View>
            <Text>333</Text>
        </View>
    );
};

export default Index;