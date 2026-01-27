import { startRecording, stopRecording } from "@/utils/audio"; // 音频录制工具
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, Platform } from "react-native";
import tencentTranslate from "@/utils/translate"; // 腾讯翻译工具
import osc from "react-native-vrc-osc"; // OSC 通信库
import * as Haptics from "expo-haptics"; // 触觉反馈工具
import { StoreContext } from "@/app/_layout"; // 全局状态 context
import { observer } from "mobx-react-lite";
import LanguageSwitch from "./components/LanguageSwitch";
import TranslateStore from "./store";
import { TranslateContext } from "./context";

const Index = () => {
    const rootStore = useContext(StoreContext); // 获取全局 store
    const store = useMemo(() => new TranslateStore(), []);
    const context = useMemo(() => ({ store }), []);
    const [isRecording, setIsRecording] = useState(false); // 是否正在录音
    const [translatedText, setTranslatedText] = useState(""); // 翻译后的文本
    const [sourceTxt, setSourceTxt] = useState(""); // 源文本 (识别到的语音)
    const [isLoading, setIsLoading] = useState(false); // 加载/翻译中状态
    const recordingRef = useRef<any>(null); // 录音对象引用
    const startTimeRef = useRef<number>(0); // 录音开始时间，用于计算录音时长是否有效

    useEffect(() => {
        // 如果 store 中存在地址和端口，初始化 OSC 客户端
        if (rootStore?.address && rootStore?.portOut) {
            osc.createClient(rootStore?.address, +rootStore?.portOut);
        }
    }, []);

    const handlePressIn = async () => {
        // 按下时触发触觉反馈 (iOS Only)
        if (Platform.OS === "ios") {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        startTimeRef.current = Date.now(); // 记录开始时间
        recordingRef.current = await startRecording(); // 开始录音
        setIsRecording(true); // 更新状态
    };

    const handlePressOut = async () => {
        if (isRecording && recordingRef.current) {
            // 当录音时间小于1秒,则视为无效录音,不与远程服务器发送请求
            const duration = Date.now() - startTimeRef.current;
            if (duration < 1000) {
                await stopRecording(recordingRef.current);
                setIsRecording(false);
                return;
            }

            // 松开时触发触觉反馈 (iOS Only)
            if (Platform.OS === "ios") {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setIsLoading(true); // 开始加载
            const audioBase64 = await stopRecording(recordingRef.current); // 停止录音并获取音频数据
            setIsRecording(false); // 更新状态

            // 调用翻译接口
            const data = await tencentTranslate(audioBase64 ?? "", {
                source: store.sourceLang,
                target: store.targetLang,
            });
            setTranslatedText(data?.target); // 更新显示翻译文本
            setSourceTxt(data?.source); // 更新显示源文本

            // 发送 OSC 消息
            osc.sendMessage("/chatbox/input", [`${data?.target}(${data?.source})`, true, true]);
            setIsLoading(false); // 结束加载
        }
    };

    return (
        <TranslateContext.Provider value={context}>
            <View className="flex-1 justify-between items-center bg-[#B8D9FF]">
                <View className="mt-6">
                    {/* 显示翻译结果和源文本 */}
                    <Text className="text-lg text-gray-800 text-center">
                        {translatedText || "翻译结果将显示在这里"}
                    </Text>
                    <Text className="text-lg text-gray-800 text-center">sourceTxt: {sourceTxt}</Text>
                </View>
                <View className="w-full items-center">
                    {/*语言切换模块*/}
                    <LanguageSwitch />
                    {/* 加载中指示器 */}
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
                        <Text className="text-white text-lg font-medium">
                            {isRecording ? "松开停止录音" : "按住说话"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </TranslateContext.Provider>
    );
};

export default observer(Index);
