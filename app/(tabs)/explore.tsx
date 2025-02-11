import { startRecording, stopRecording } from "@/utils/audio";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, ActivityIndicator, Pressable, Platform } from "react-native";
import tencentTranslate from "@/utils/translate";
import { Audio } from "expo-av";
// @ts-ignore
import osc from "react-native-osc";
import * as Haptics from "expo-haptics";

export default function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const [sourceTxt, setSourceTxt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const recordingRef = useRef<any>(null);

    useEffect(() => {
        const portOut = 9000;
        const address = "192.168.31.180";
        osc.createClient(address, portOut);
    }, []);
    const handlePressIn = async () => {
        // 触发触觉反馈
        if (Platform.OS === "ios") {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        recordingRef.current = await startRecording();
        setIsRecording(true);
    };

    const handlePressOut = async () => {
        if (isRecording) {
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

            osc.sendMessage("/chatbox/input", [data?.target, true, true]);
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#B8D9FF' }}>
            <Text style={{ marginTop: 20, fontSize: 18 }}>{translatedText || "翻译结果将显示在这里"}</Text>
            <Text>sourceTxt: {sourceTxt}</Text>
            {isLoading && <ActivityIndicator size="large" color="#80C7FF" style={{ marginTop: 20 }} />}
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="w-[100] h-[100] bg-red-500 rounded-[50] items-center justify-center mt-6"
                style={({ pressed }) => ({
                    backgroundColor: pressed ? '#F4A8A8' : '#FF6B6B',
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                    padding: 20,
                    borderRadius: 50,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 6, // 为按钮添加阴影效果
                })}
            >
                <Text style={{ color: "white" }}>{isRecording ? "松开停止录音" : "按住说话"}</Text>
            </Pressable>
        </View>
    );
}
