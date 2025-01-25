import {Image, StyleSheet, Platform, TouchableOpacity, Text, NativeEventEmitter, ScrollView} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useEffect, useState} from "react";
// @ts-ignore
import osc from 'react-native-osc';
import oscData from "./data.json";
import { DataT } from "@/app/(tabs)/types";


export default function HomeScreen() {
    const [data, setData] = useState<any>(undefined);
    const [oscArr, setOscArr] = useState<any>(oscData?.parameters);

    useEffect(() => {
        // console.warn(oscData);
    }, []);

    useEffect(() => {
        const eventEmitter = new NativeEventEmitter(osc);

        eventEmitter.addListener("GotMessage", (oscMessage) => {
            // console.warn("message: ", oscMessage);
            if (oscMessage?.address === "/avatar/change") {
                setData(oscMessage.data?.[0]);
            }
            // setData(oscMessage);
        });

        try {
            osc.createServer("", 9001);
            console.log("OSC server created successfully");
        } catch (error) {
            console.error("Error creating OSC server:", error);
        }
    }, []);

    useEffect(() => {
        const portOut = 9000;
// //OSC server IP address like "192.168.1.80" or "localhost"
//         const address = "192.168.31.180";
        const address = "192.168.31.180";
//
// //create the client only once in componentDidMount
        osc.createClient(address, portOut);

//now you can send OSC messages like this (only after creating a client)
//         osc.sendMessage("/address/", [1.0, 0.5]);

//send any combination of integers, floats, bool & string values:
//         osc.sendMessage("/address/", ["string value", 1, false, 0.5]);
//         osc.sendMessage("/input/Horizontal/",)
//         osc.sendMessage("/input/Jump")

    }, []);

    const handleJump = (param: number) => {
        osc.sendMessage("/input/Jump", [param]);
        console.log("sendMessage");
    };

    const handleAnimate = () => {
        // osc.sendMessage("/avatar/parameters/VRCEmote")
        osc.sendMessage("/avatar/parameters/AFK", true);
        osc.sendMessage("/avatar/parameters/Horns", [false]);
        osc.sendMessage("/avatar/parameters/Sword", [true]);
    };
    const handleAnimate2 = () => {
        // osc.sendMessage("/avatar/parameters/VRCEmote")
        osc.sendMessage("/avatar/parameters/AFK", ["True"]);
        osc.sendMessage("/avatar/parameters/Horns", [true]);
        osc.sendMessage("/avatar/parameters/Sword", [false]);
    };

    const handleAnimate3 = () => {
        // osc.sendMessage("/avatar/parameters/VRCEmote")
        // osc.sendMessage("/avatar/parameters/AFK", ["True"]);
        osc.sendMessage("/avatar/parameters/AFK", [true]);
        // osc.sendMessage("/avatar/parameters/AFK", [true]);
        // osc.sendMessage("/avatar/parameters/Horns", [true]);
        // osc.sendMessage("/avatar/parameters/VRCEmote", [1]);
    };

    const handleOperate = (item: DataT, index: number) => {
        if(item.input?.type === "Bool") {
            const status: boolean = item?.status ?? false;
            console.warn(status, "status");
            osc.sendMessage(item.input?.address, [!status]);
            oscArr[index].status = !status;
            console.warn(oscArr[index]);
            setOscArr([...oscArr]);
        }
        // osc.sendMessage(item.input?.address, [item.value]);
    }


    return (
        <ScrollView>
            {oscArr?.map((item: any, index: number) => {
                return (
                    <TouchableOpacity key={index}
                                      className={`m-2 p-2 rounded ${item.status ? "bg-green-500" : "bg-red-500"}`}
                                      onPress={() => handleOperate(item, index)}>
                        <Text className="text-3xl">{item.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};
