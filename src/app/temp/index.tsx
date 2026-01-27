import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import decodeBase64 from "@/utils/decodeBase64";
import osc from "react-native-vrc-osc";

const Index = () => {
    const [commandString, setCommandString] = useState("");
    const params = useLocalSearchParams();

    useEffect(() => {
        // 处理从根 Layout 传递过来的参数
        const handleDeepLink = () => {
            console.log("temp 页面收到参数:", params);

            if (params?.isClear) {
                if (params?.message === "openGun") {
                    osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_Weapon_off", [false]);
                    osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_grab_on", [true]);
                    setCommandString("打开散弹枪");
                    return;
                }
                if (params?.message === "closeGun") {
                    osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_Weapon_off", [true]);
                    osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_grab_on", [false]);
                    setCommandString("关闭散弹枪");
                    return;
                }
            }

            if (params?.istranslate) {
                const decodedMessage = decodeBase64(params?.message as string);
                console.warn("解码后的消息:", decodedMessage);
                osc.sendMessage("/chatbox/input", [`${decodedMessage}`, true, true]);
                setCommandString(decodedMessage);
                return;
            }

            if (params?.message) {
                const decodedMessage = params?.message as string;
                console.warn("解码后的消息:", decodedMessage);

                const steakRegex = /(?:不吃牛|no\s*steak|close\s*steak)/i;
                if (steakRegex.test(decodedMessage)) {
                    osc.sendMessage("/avatar/parameters/steak", [false]);
                    setCommandString("关闭牛排");
                    return;
                }

                if (decodedMessage.includes("牛排") || decodedMessage.includes("steak")) {
                    osc.sendMessage("/avatar/parameters/steak", [true]);
                    setCommandString("打开牛排");
                }
            }
        };

        handleDeepLink(); // 处理参数
    }, [params]); // 当参数变化时重新执行

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-4xl">{commandString}</Text>
        </View>
    );
};

export default Index;
