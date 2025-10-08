import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Linking from 'expo-linking';
import decodeBase64 from "@/utils/decodeBase64";
import osc from "react-native-vrc-osc";


const Index = () => {
    const [commandString, setCommandString] = useState("");


    useEffect(() => {
        console.log("useEffect");

        // 处理初始链接
        const getInitialURL = async () => {
            console.warn(1111);
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

            if(queryParams?.isClear){
                if(queryParams?.message === "openGun"){
                    osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_Weapon_off", [false]);
                    osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_grab_on", [true]);
                    setCommandString("打开散弹枪");
                    return;
                }
                if(queryParams?.message === "closeGun"){
                    osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_Weapon_off", [true]);
                    osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_grab_on", [false]);
                    setCommandString("关闭散弹枪");
                    return;
                }
            }

            if(queryParams?.istranslate){
                const decodedMessage = decodeBase64(queryParams?.message as string);
                console.warn("解码后的消息:", decodedMessage);
                osc.sendMessage("/chatbox/input", [`${decodedMessage}`, true, true]);
                setCommandString(decodedMessage);
                return;
            }

            if ( queryParams?.message) {
                // const decodedMessage = decodeBase64(queryParams?.message as string);
                const decodedMessage = queryParams?.message as string;
                console.warn("解码后的消息:", decodedMessage);
                // if(decodedMessage.includes("不吃牛") || decodedMessage.includes("no steak")){
                //     osc.sendMessage("/avatar/parameters/steak", [true]);
                //     return;
                // }

                const steakRegex = /(?:不吃牛|no\s*steak|close\s*steak)/i;
                if (steakRegex.test(decodedMessage)) {
                    osc.sendMessage("/avatar/parameters/steak", [false]);
                    setCommandString("关闭牛排");
                    return;
                }

                if(decodedMessage.includes("牛排") || decodedMessage.includes("steak")){
                    osc.sendMessage("/avatar/parameters/steak", [true]);
                    setCommandString("打开牛排");
                }
            }
        };

        getInitialURL(); // 检查初始链接
        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, []);


    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-4xl">{commandString}</Text>
        </View>
    );
};

export default Index;