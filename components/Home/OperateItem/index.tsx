import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    CurvedTransition,
    LinearTransition,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Props } from "@/components/Home/OperateItem/types";

const Index: React.FC<Props> = ({ item, index, ...props }) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate(event => {
            const newTranslateX = startX.value + event.translationX;
            translateX.value = Math.min(Math.max(newTranslateX, -100), 0);
        })
        .onEnd(event => {
            translateX.value = withTiming(event.translationX < -100 ? -100 : 0);
        });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={rStyle} layout={CurvedTransition}>
                <View className="flex-row">
                    <TouchableOpacity
                        className={`flex-1 my-2 mx-3 p-2 rounded ${item.status ? "bg-green-500" : "bg-red-500"} flex-row items-center justify-between`}
                        // onPress={() => props.onOperate(item, index)}
                    >
                        <Text className="text-3xl">{item.name}</Text>
                        <Switch
                            onChange={() => props.onOperate(item, index)}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={item.status ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            value={item.status}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red-500 justify-center items-center w-20 absolute -right-[80] top-0 h-[50]"
                        onPress={() => runOnJS(props.onDelete)(index)}
                    >
                        <Text className="text-white text-base">删除</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

export default Index;