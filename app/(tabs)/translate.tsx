import { startRecording, stopRecording } from "@/utils/audio";
import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, Platform } from "react-native";
import tencentTranslate from "@/utils/translate";
// @ts-ignore
import osc from "react-native-osc";
import * as Haptics from "expo-haptics";
import { StoreContext } from "@/app/_layout";
import { observer } from "mobx-react-lite";

const Index = () => {
    const rootStore = useContext(StoreContext);
    const [isRecording, setIsRecording] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const [sourceTxt, setSourceTxt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const recordingRef = useRef<any>(null);

    useEffect(() => {
        // const portOut = 9000;
        // const address = "192.168.31.180";
        // osc.createClient(address, portOut);
        osc.createClient(rootStore?.address, rootStore?.portOut);
    }, [rootStore?.address, rootStore?.portOut]);
    const handlePressIn = async () => {
        // 触发触觉反馈
        if (Platform.OS === "ios") {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        recordingRef.current = await startRecording();
        setIsRecording(true);
    };

    const handlePressOut = async () => {
        if (isRecording && recordingRef.current) {
            if (Platform.OS === "ios") {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setIsLoading(true);
            const audioBase64 = await stopRecording(recordingRef.current);
            setIsRecording(false);

            const data = await tencentTranslate(audioBase64 ?? "");
            console.log(data);
            setTranslatedText(data?.target);
            setSourceTxt(data?.source);

            osc.sendMessage("/chatbox/input", [`${data?.target}(${data?.source})`, true, true]);
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-between items-center bg-[#B8D9FF]">
            <View className="mt-6">
                <Text className="text-lg text-gray-800 text-center">{translatedText || "翻译结果将显示在这里"}</Text>
                <Text className="text-lg text-gray-800 text-center">sourceTxt: {sourceTxt}</Text>
            </View>
            {isLoading && <ActivityIndicator size="large" color="#80C7FF" style={{ marginTop: 20 }} />}
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="w-[200] h-[200] bg-red-500 rounded-[50] items-center justify-center shadow-lg active:bg-red-600 mb-3"
                style={({ pressed }) => ({
                    backgroundColor: pressed ? "#F4A8A8" : "#FF6B6B",
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                    padding: 20,
                    borderRadius: 50,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 6, // 为按钮添加阴影效果
                })}
            >
                <Text className="text-white text-lg font-medium">{isRecording ? "松开停止录音" : "按住说话"}</Text>
            </Pressable>
        </View>
    );
}

export default observer(Index);
