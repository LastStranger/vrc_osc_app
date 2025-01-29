import React, { useContext, useEffect } from "react";
import { Pressable, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    CurvedTransition,
    LinearTransition,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector, TapGestureHandler } from "react-native-gesture-handler";
import { Props } from "@/components/Home/OperateItem/types";
import { HomeContext } from "@/app/(tabs)";
import { index } from "@zxing/text-encoding/es2015/encoding/indexes";
import { observer } from "mobx-react-lite";

const Index: React.FC<Props> = ({ item, index, ...props }) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const homeStore = useContext(HomeContext);
    const {changeStatus, deleteOscItem, changeItemSlideStatus } = homeStore;
    // // const actIndex = useStore(store, s => s.actIndex);
    // const changeActIndex = useStore(store, s => s.changeActIndex);
    // const changeStatus = useStore(store, s => s.changeStatus);
    // const deleteOscItem = useStore(store, s => s.deleteOscItem);
    // const status = useStore(store, s => s.oscArr[index].status);

    useEffect(() => {
        // if(actIndex !== index && translateX.value !== 0) {
        //     translateX.value = withTiming(0);
        // }
        // console.log(homeStore.actIndex, "actIndexout");
        // if(homeStore.actIndex === undefined) {
        //     console.log(homeStore.actIndex, "actIndex111");
        //     translateX.value = withTiming(0);
        // }
        if(item.slideStatus === false){
            translateX.value = withTiming(0);
        }
    }, [item.slideStatus]);


    // useEffect(() => {
    //     console.log(status, "status");
    // }, [status]);

    const panGesture = Gesture.Pan()
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
        });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    // 点击回归item初始状态
    const handlePress = () => {
        translateX.value = withTiming(0);
        console.warn(123123);
    };

    // 切换状态
    const handleSwitchStatus = (index: number) => {
        changeStatus(index);
    };

    // 删除item
    const handleDelete = () => {
        console.log(item.name);
        deleteOscItem(item.name);
    };

    console.log("render small item");

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={rStyle} layout={CurvedTransition}>
                <View className="flex-row">
                    <TapGestureHandler
                        maxDeltaX={10} // 最大允许的水平滑动距离（像素）
                        maxDeltaY={10} // 最大允许的垂直滑动距离（像素）
                        onActivated={handlePress} // 点击事件回调
                    >
                        <View
                            className={`flex-1 my-2 mx-3 p-2 rounded ${item.status ? "bg-green-500" : "bg-red-500"} flex-row items-center justify-between`}
                            // onPress={handlePress}
                        >
                            <Text className="text-3xl">{item.name}</Text>
                            <Switch
                                // onChange={() => props.onOperate(item)}
                                onChange={() => handleSwitchStatus(index)}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={item.status ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                value={item.status}
                            />
                        </View>
                    </TapGestureHandler>
                    <TouchableOpacity
                        className="bg-red-500 justify-center items-center w-20 absolute -right-[80] top-0 h-[50]"
                        onPress={() => runOnJS(handleDelete)()}
                    >
                        <Text className="text-white text-base">删除</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

export default observer(Index);
