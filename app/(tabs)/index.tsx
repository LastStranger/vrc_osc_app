import {
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Text,
    NativeEventEmitter,
    ScrollView,
    Switch,
    View,
    Pressable,
    StatusBar,
    FlatList,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore
import osc from 'react-native-osc';
import oscData from "./data.json";
import { DataT } from "@/store/types";
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { Link } from "expo-router";
import OperateItem from "@/components/Home/OperateItem";
import HomeStore from "@/store/homeStore";
import { observer } from "mobx-react-lite";

export const HomeContext = createContext<HomeStore>(undefined as any);

function HomeScreen() {
    const store = useMemo(() => new HomeStore(), []);

    useEffect(() => {
        console.log("oscArr change11");
    }, [store?.oscArr]);

    useEffect(() => {
        console.log("Store11 actIndex changed:", store.actIndex);
    }, [store.actIndex]);

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

        //create the client only once in componentDidMount
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

    // const handleTrigger = (index: number) => {
    //     console.log(store.oscArr[index]);
    // }

    // 滑动的时候,关闭激活中的Item
    const handleScroll = () => {
        store.changeActIndex(undefined);
    };

    const renderItem = ({ item, index }: { item: DataT; index: number }) => {
        return (
            <OperateItem
                item={item}
                index={index}
            />
        );
    };

    return (
        <HomeContext.Provider value={store}>
            <LinearGradient
                style={{ flex: 1 }}
                // colors={["#09203f", "#537895"]}
                colors={['#A3C8FF', '#E0E4FF']} // 背景渐变色
            >
                <GestureHandlerRootView className="flex-1  pt-16">
                    {/*<Link href="/temp"><Text>333</Text></Link>*/}
                    <FlatList
                        className="flex-1"
                        keyExtractor={(item: DataT, index: number) => item.name}
                        onScroll={handleScroll}
                        data={store.oscArr}
                        renderItem={renderItem}
                    />
                </GestureHandlerRootView>
            </LinearGradient>
        </HomeContext.Provider>
    );
}

export default observer(HomeScreen);
