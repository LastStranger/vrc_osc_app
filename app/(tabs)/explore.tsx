import { startRecording, stopRecording } from "@/utils/audio";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, ActivityIndicator } from 'react-native';
import tencentTranslate from "@/utils/translate";
import { Audio } from "expo-av";
// @ts-ignore
import osc from "react-native-osc";

export default function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [translatedText, setTranslatedText] = useState('');
    const [sourceTxt, setSourceTxt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const recordingRef = useRef<any >(null);

    useEffect(() => {
        const portOut = 9000;
        const address = "192.168.31.180";
        osc.createClient(address, portOut);
    }, []);

    const handleRecordPress = async () => {
        if (!isRecording) {
            recordingRef.current = await startRecording();
            setIsRecording(true);
        } else {
            setIsLoading(true);
            const audioBase64 = await stopRecording(recordingRef.current);
            setIsRecording(false);

            // 语音识别
            // const chineseText = await TencentASR(audioBase64 ?? "");
            const data = await tencentTranslate(audioBase64 ?? "");
            console.log(data);
            setTranslatedText(data?.target);
            setSourceTxt(data?.source);

            osc.sendMessage('/chatbox/input', [data?.target, true, true]);
            // if (chineseText) {
            //     // 机器翻译
            //     const englishText = await tencentTranslate(chineseText);
            //     setTranslatedText(englishText);
            // }
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button
                title={isRecording ? '停止录音' : '开始录音'}
                onPress={handleRecordPress}
                disabled={isLoading}
            />
            {isLoading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
            <Text style={{ marginTop: 20, fontSize: 18 }}>
                {translatedText || '翻译结果将显示在这里'}
            </Text>
            <Text>sourceTxt: {sourceTxt}</Text>
        </View>
    );
}