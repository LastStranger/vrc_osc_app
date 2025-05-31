import React, { useContext, useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector, LongPressGestureHandler } from "react-native-gesture-handler";
import { Props } from "@/components/Home/OperateItem/types";
import { observer } from "mobx-react-lite";
import { HomeContext } from "@/app/(tabs)";
import osc from "react-native-vrc-osc";
import * as Haptics from 'expo-haptics'; // 导入 expo-haptics


const FloatItem: React.FC<Props> = ({ item, index }) => {
    const { store } = useContext(HomeContext);
    const progress = useSharedValue(0);
    const offsetX = useSharedValue(0);
    const [progressDisplay, setProgressDisplay] = useState(0);


    const handleLongPress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert("删除确认", `确定要删除 ${item.name} 吗？`, [
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
        ]);
    };

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
            runOnJS(setProgressDisplay)(progress.value); // 用 runOnJS 同步到 React
        })
        .onEnd(() => {
            offsetX.value = progress.value * 2;

            // 将progress值（0-100）映射到0-1之间的float数据
            const floatValue = progress.value / 100;

            // 发送OSC消息
            if (address) {
                runOnJS(sendOscMessage)(address, floatValue);
            }
        });

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
        <LongPressGestureHandler minDurationMs={800} onActivated={() => runOnJS(handleLongPress)()}>
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
                                <Text style={{ position: 'absolute', top: 10, right: 0 }}>{Math.round(progressDisplay)}%</Text>
                            </View>
                        </View>
                    </View>
                </GestureDetector>
            </Animated.View>
        </LongPressGestureHandler>
    );
};

export default observer(FloatItem);
