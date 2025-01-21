import {
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Text,
    NativeEventEmitter,
    ScrollView,
    Switch, View, Pressable
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
// import osc from 'react-native-osc';
import oscData from "./data.json";
import { DataT } from "@/app/(tabs)/types";
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { Link } from "expo-router";


export default function HomeScreen() {
    const [data, setData] = useState<any>(undefined);
    const [oscArr, setOscArr] = useState<any>(oscData?.parameters);

    useEffect(() => {
        // console.warn(oscData);
    }, []);

    useEffect(() => {
        // const eventEmitter = new NativeEventEmitter(osc);
        //
        // eventEmitter.addListener("GotMessage", (oscMessage) => {
        //     // console.warn("message: ", oscMessage);
        //     if (oscMessage?.address === "/avatar/change") {
        //         setData(oscMessage.data?.[0]);
        //     }
        //     // setData(oscMessage);
        // });
        //
        // try {
        //     osc.createServer("", 9001);
        //     console.log("OSC server created successfully");
        // } catch (error) {
        //     console.error("Error creating OSC server:", error);
        // }
    }, []);

    useEffect(() => {
        const portOut = 9000;
// //OSC server IP address like "192.168.1.80" or "localhost"
//         const address = "192.168.31.180";
        const address = "192.168.31.180";
//
// //create the client only once in componentDidMount
//         osc.createClient(address, portOut);

//now you can send OSC messages like this (only after creating a client)
//         osc.sendMessage("/address/", [1.0, 0.5]);

//send any combination of integers, floats, bool & string values:
//         osc.sendMessage("/address/", ["string value", 1, false, 0.5]);
//         osc.sendMessage("/input/Horizontal/",)
//         osc.sendMessage("/input/Jump")

    }, []);

    // const handleJump = (param: number) => {
    //     osc.sendMessage("/input/Jump", [param]);
    //     console.log("sendMessage");
    // };
    //
    // const handleAnimate = () => {
    //     // osc.sendMessage("/avatar/parameters/VRCEmote")
    //     osc.sendMessage("/avatar/parameters/AFK", true);
    //     osc.sendMessage("/avatar/parameters/Horns", [false]);
    //     osc.sendMessage("/avatar/parameters/Sword", [true]);
    // };
    // const handleAnimate2 = () => {
    //     // osc.sendMessage("/avatar/parameters/VRCEmote")
    //     osc.sendMessage("/avatar/parameters/AFK", ["True"]);
    //     osc.sendMessage("/avatar/parameters/Horns", [true]);
    //     osc.sendMessage("/avatar/parameters/Sword", [false]);
    // };
    //
    // const handleAnimate3 = () => {
    //     // osc.sendMessage("/avatar/parameters/VRCEmote")
    //     // osc.sendMessage("/avatar/parameters/AFK", ["True"]);
    //     osc.sendMessage("/avatar/parameters/AFK", [true]);
    //     // osc.sendMessage("/avatar/parameters/AFK", [true]);
    //     // osc.sendMessage("/avatar/parameters/Horns", [true]);
    //     // osc.sendMessage("/avatar/parameters/VRCEmote", [1]);
    // };

    const handleOperate = (item: DataT, index: number) => {
        if (item.input?.type === "Bool") {
            const status: boolean = item?.status ?? false;
            console.warn(status, "status");
            // osc.sendMessage(item.input?.address, [!status]);
            oscArr[index].status = !status;
            console.warn(oscArr[index]);
            setOscArr([...oscArr]);
        }
        // osc.sendMessage(item.input?.address, [item.value]);
    };

    const handleDelete = (index: number) => {
        const newOscArr = oscArr.filter((_: any, i: number) => i !== index);
        setOscArr(newOscArr);
    };



    return (
        <GestureHandlerRootView className="flex-1 bg-green-500">
            <Link href="/temp">跳转</Link>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            >
                {oscArr?.map((item: any, index: number) => (
                    <ListItem key={index} item={item} index={index} />
                ))}
            </ScrollView>
        </GestureHandlerRootView>
    );
};

const ListItem = ({ item, index }: { item: DataT; index: number }) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);


    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((event) => {
            const newTranslateX = startX.value + event.translationX;
            translateX.value = Math.min(Math.max(newTranslateX, -100), 0);
        })
        .onEnd((event) => {
            translateX.value = withTiming(event.translationX < -100 ? -100 : 0);
        });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={rStyle}>
                <View className="flex-row bg-yellow-300">
                    <TouchableOpacity
                        className={`flex-1 my-2 mx-3 p-2 rounded ${item.status ? "bg-green-500" : "bg-red-500"} flex-row items-center justify-between`}
                        // onPress={() => handleOperate(item, index)}
                    >
                        <Text className="text-3xl">{item.name}</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={item.status ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            value={item.status}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red-500 justify-center items-center w-20 absolute -right-[80] top-0"
                        // onPress={() => runOnJS(handleDelete)(index)}
                    >
                        <Text className="text-white text-base">删除1</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

