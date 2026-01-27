import React, { useCallback, useContext, useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Props } from "@/components/Home/OperateItem/types";
import { observer } from "mobx-react-lite";
import { HomeContext } from "@/app/(tabs)";
import osc from "react-native-vrc-osc";
import * as Haptics from "expo-haptics"; // 导入 expo-haptics
import { scheduleOnRN } from "react-native-worklets";
import { DataT } from "@/store/types";

const Index = ({ item, index }: Props) => {
    const { store } = useContext(HomeContext);
    const progress = useSharedValue(0);
    const offsetX = useSharedValue(0);
    const [progressDisplay, setProgressDisplay] = useState(0);

    const handleLongPress = useCallback(
        async () => {
            try {
                // 重度振动反馈，提升长按感知
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            } catch (error) {
                // haptics 在某些设备/模拟器上可能失败，静默忽略
                console.warn("Haptics failed:", error);
            }

            Alert.alert(
                "删除确认",
                `确定要删除 “${item.name}” 吗？`,
                [
                    {
                        text: "取消",
                        style: "cancel",
                    },
                    {
                        text: "删除",
                        style: "destructive",
                        onPress: () => {
                            store.deleteOscItem(item.name);
                        },
                    },
                ],
                { cancelable: true }, // 允许点击外部或返回键取消（提升 UX）
            );
        },
        [], // 如果 store 是稳定的（如 zustand/mobx 单例），依赖为空
    );

    const sendOscMessage = (addr: string, value: number) => {
        osc.sendMessage(addr, [value]);
    };

    const address = useMemo(() => item.input?.address, [item.input?.address]);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10]) // 水平方向超过10px才激活
        .failOffsetY([-10, 10]) // 垂直方向超过10px就失败
        .onUpdate(event => {
            // 限制滑动范围在0-100之间
            progress.value = Math.max(0, Math.min(100, (event.translationX + offsetX.value) / 2));
            scheduleOnRN(setProgressDisplay, progress.value);
        })
        .onEnd(() => {
            offsetX.value = progress.value * 2;

            // 将progress值（0-100）映射到0-1之间的float数据
            const floatValue = progress.value / 100;

            // 发送OSC消息
            if (address) {
                scheduleOnRN(sendOscMessage, address, floatValue);
            }
        });

    const longPressGesture = useMemo(
        () =>
            Gesture.LongPress()
                .minDuration(800)
                .onStart(() => {
                    scheduleOnRN(handleLongPress);
                }),
        [handleLongPress],
    );

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = -(100 - progress.value);
        return {
            backgroundColor: "#80C7FF",
            position: "absolute",
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,
            borderRadius: 8,
            transform: [
                {
                    translateX: `${translateX}%`,
                },
            ],
        };
    });

    return (
        <GestureDetector gesture={longPressGesture}>
            <Animated.View
                className="flex-row"
                style={[
                    {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 10 },
                        shadowRadius: 10,
                        shadowOpacity: 0.1,
                        elevation: 5,
                    },
                ]}
            >
                <GestureDetector gesture={panGesture}>
                    <View
                        className="flex-1 my-2 mx-3 rounded-lg bg-[#F5F8FF] overflow-hidden"
                        // style={{ position: 'relative' }}
                    >
                        <Animated.View style={animatedStyle} />
                        <View className="p-2" style={{ zIndex: 1 }}>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-3xl flex-1">{item.name}</Text>
                                <Text style={{ position: "absolute", top: 10, right: 0 }}>
                                    {Math.round(progressDisplay)}%
                                </Text>
                            </View>
                        </View>
                    </View>
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
    );
};

export default observer(Index);
