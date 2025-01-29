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
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore
// import osc from 'react-native-osc';
import oscData from "./data.json";
import { DataT } from "@/app/(tabs)/types";
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
import { StoreApi, useStore } from "zustand";
import HomeStore from "@/store/homeStore";
import { observer } from "mobx-react-lite";

export const HomeContext = createContext<HomeStore>(undefined as any);

function HomeScreen() {
    const store = useMemo(() => new HomeStore(), []);

    useEffect(() => {
        console.log("oscArr change11");
    }, [store?.oscArr]);

    useEffect(() => {
        console.log('Store11 actIndex changed:', store.actIndex);
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

    const handleOperate = useCallback((item: DataT) => {
        if (item.input?.type === "Bool") {
            const status: boolean = item?.status ?? false;
            console.warn(status, "status");
            // osc.sendMessage(item.input?.address, [!status]);
            // oscArr[index].status = !status;
            // console.warn(oscArr[index].status, "status");
            // setOscArr([...oscArr]);
        }
        // osc.sendMessage(item.input?.address, [item.value]);
    }, []);

    const handleDelete = useCallback((item: any) => {
        // const newOscArr = oscArr.filter((_: any, i: number) => i !== index);
        // setOscArr(newOscArr);
        // setOscArr(prevState => prevState.filter((curr: any, i: number) => curr.name !== item.name));
    }, []);

    const handleScroll = () => {
        // console.warn("out scroll");
        // store.setState({ actIndex: undefined });
        store.changeActIndex(undefined);
        console.log("scroll");
    };

    console.log("render home out");

    return (
        <HomeContext.Provider value={store}>
            <LinearGradient
                style={{ flex: 1 }}
                // className="flex-1 bg-orange-300"
                colors={["#09203f", "#537895"]}
            >
                <GestureHandlerRootView className="flex-1  pt-16">
                    {/*<Dd/>*/}
                    {/*<Link href="/temp">跳转11</Link>*/}
                    {/*<Text onPress={() => store.changeActIndex(undefined)}>{999}</Text>*/}
                    <ScrollView className="flex-1" onScroll={handleScroll}>
                        {store?.oscArr?.map((item: DataT, index: number) => (
                            <OperateItem
                                // onOperate={handleOperate}
                                // onDelete={handleDelete}
                                key={item.name}
                                item={item}
                                // status={item.status}
                                index={index}
                            />
                        ))}
                    </ScrollView>
                </GestureHandlerRootView>
            </LinearGradient>
        </HomeContext.Provider>
    );
}

export default observer(HomeScreen);
