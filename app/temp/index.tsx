import React, { useEffect } from "react";
import { View, Text } from "react-native";
import * as Linking from 'expo-linking';
import decodeBase64 from "@/utils/decodeBase64";


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

            if ( queryParams?.message) {
                const decodedMessage = decodeBase64(queryParams?.message as string);
                console.warn("解码后的消息:", decodedMessage);
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