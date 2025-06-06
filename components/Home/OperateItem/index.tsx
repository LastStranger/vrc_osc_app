import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { Pressable, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    CurvedTransition,
    FadeIn,
    FadeInDown,
    FadeOut,
    LayoutAnimationConfig,
    LinearTransition,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector, TapGestureHandler } from "react-native-gesture-handler";
import { Props } from "@/components/Home/OperateItem/types";
import { HomeContext } from "@/app/(tabs)";
import { observer } from "mobx-react-lite";
import { DataT } from "@/store/types";
import FloatItem from "@/components/Home/OperateItem/FloatItem";

const Index: React.FC<Props> = ({ item, index, ...props }) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const { store } = useContext(HomeContext);
    const { changeStatus, deleteOscItem, changeItemSlideStatus } = store;

    // useEffect(() => {
    //     console.warn("initial renderinitial renderinitial renderinitial renderinitial render");
    // }, []);
    //
    // useEffect(() => {
    //     console.warn("changeStatus:", index);
    // }, [changeStatus]);
    //
    // useEffect(() => {
    //     console.warn("deleteOscItem:");
    // }, [deleteOscItem]);
    //
    // useEffect(() => {
    //     console.warn("changeItemSlideStatus:");
    // }, [changeItemSlideStatus]);
    //
    // useEffect(() => {
    //     console.warn("handleTrigger:");
    // }, [handleTrigger]);

    // 如果item的滑动状态变为false，则将translateX设置为0
    useEffect(() => {
        if (item.slideStatus === false) {
            translateX.value = withTiming(0);
        }
    }, [item.slideStatus]);

    // useEffect(() => {
    //     if (item.status) {
    //         handleTrigger(index);
    //     }
    // }, [item.status, index, handleTrigger]);

    // 滑动手势
    const panGesture = useMemo(
        () =>
            Gesture.Pan()
                .activeOffsetX([-10, 10])
                .onStart(() => {
                    startX.value = translateX.value;
                    runOnJS(changeItemSlideStatus)(index ?? 0, false);
                })
                .onUpdate(event => {
                    const newTranslateX = startX.value + event.translationX;
                    translateX.value = Math.min(Math.max(newTranslateX, -100), 0);
                })
                .onEnd(event => {
                    translateX.value = withTiming(event.translationX < -50 ? -100 : 0);
                    runOnJS(changeItemSlideStatus)(index, true);
                }),
        [index, changeItemSlideStatus],
    );

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    // 点击回归item初始状态
    const handlePress = useCallback(() => {
        translateX.value = withTiming(0);
    }, []);

    // 切换状态
    const handleSwitchStatus = useCallback(
        (index: number) => {
            changeStatus(index);
        },
        [changeStatus],
    );

    // 删除item
    const handleDelete = useCallback(() => {
        deleteOscItem(item.name);
    }, [deleteOscItem, item.name]);

    const getTextColorClass = (item: DataT) => {
        // 基础样式包含文字大小
        const baseStyle = "text-3xl  flex-1";

        // 如果不是 Bool 类型，显示为灰色（禁用状态）
        if (item.input?.type !== "Bool") {
            return `${baseStyle} text-gray-400`;
        }

        // 是 Bool 类型，根据激活状态显示白色或黑色
        return `${baseStyle} ${item.status ? "text-white" : "text-black"}`;
    };

    // console.warn("item render");

    const renderItem = useMemo(() => {
        if (item.input?.type === "Bool") {
            return (
                <Animated.View
                    className="flex-row"
                    style={[
                        {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 10 },
                            shadowRadius: 10,
                            shadowOpacity: 0.1,
                            elevation: 5, // Android 需要 elevation
                        },
                        rStyle,
                    ]}
                >
                    <TapGestureHandler
                        maxDeltaX={10} // 最大允许的水平滑动距离（像素）
                        maxDeltaY={10} // 最大允许的垂直滑动距离（像素）
                        onActivated={handlePress} // 点击事件回调
                    >
                        <View
                            className={`flex-1 my-2 mx-3 p-2 rounded-lg ${item.status ? "bg-[#80C7FF]" : "bg-[#F5F8FF]"} flex-row items-center justify-between`}
                            // onPress={handlePress}
                        >
                            <Text className={getTextColorClass(item)}>{item.name}</Text>
                            <Switch
                                // onChange={() => props.onOperate(item)}
                                onChange={() => handleSwitchStatus(index)}
                                trackColor={{ false: "#D1E6FF", true: "#80C7FF" }}
                                thumbColor={item.status ? "#FFFFFF" : "#B0C4DE"}
                                // color="#80C7FF"
                                ios_backgroundColor="#D1E6FF"
                                value={item.status}
                            />
                        </View>
                    </TapGestureHandler>
                    <TouchableOpacity
                        className="bg-[#FF6B6B] rounded justify-center items-center w-20 absolute -right-[80] top-0 bottom-0 my-2"
                        onPress={() => runOnJS(handleDelete)()}
                    >
                        <Text className="text-white text-base">删除</Text>
                    </TouchableOpacity>
                </Animated.View>
            );
        }
        if(item.input?.type === "Float"){
            return <FloatItem item={item} index={index} />;
        }
    }, [item.input?.type, index, handleDelete, item.status, handleSwitchStatus]);

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View
                layout={LinearTransition.springify().damping(14)}
                entering={FadeInDown.springify().damping(14)}
                exiting={FadeOut.springify().damping(14)}
            >
                {renderItem}
            </Animated.View>
        </GestureDetector>
    );
};

export default observer(Index);
