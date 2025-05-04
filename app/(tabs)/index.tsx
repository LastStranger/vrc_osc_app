import { Text, View, FlatList } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { DataT, HomeContextT } from "@/store/types";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import OperateItem from "@/components/Home/OperateItem";
import HomeStore from "@/store/homeStore";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/app/_layout";

export const HomeContext = createContext<HomeContextT>({} as any);

function HomeScreen() {
    const rootStore = useContext(StoreContext);
    const store = useMemo(() => new HomeStore(rootStore!), []);
    const contextValue = useMemo(() => ({ store }), [store]);

    useEffect(() => {
        return () => {
            store.dispose();
        };
    }, [store]);

    // useEffect(() => {
    //     store.resetOscClient(rootStore?.address, rootStore?.portOut);
    // }, [rootStore?.portOut, rootStore?.address]);
    //
    // //监听avatarInfo的变化
    // useEffect(() => {
    //     store.resetOscArr(rootStore?.avatarInfo);
    // }, [rootStore?.avatarInfo]);

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

    // 滑动的时候,关闭激活中的Item
    const handleScroll = () => {
        store.changeActIndex(undefined);
    };

    const renderItem = useCallback(({ item, index }: { item: DataT; index: number }) => {
        return <OperateItem item={item} index={index} />;
    }, []);


    return (
        <HomeContext.Provider value={contextValue}>
            <LinearGradient
                style={{ flex: 1 }}
                colors={["#A3C8FF", "#E0E4FF"]} // 背景渐变色
            >
                <GestureHandlerRootView className="flex-1  pt-16">
                    <FlatList
                        className="flex-1"
                        // contentContainerStyle={{ flex:1 }}
                        keyExtractor={(item: DataT, index: number) => item.name}
                        onScroll={handleScroll}
                        data={store.oscArr}
                        renderItem={renderItem}
                        ListEmptyComponent={EmptyListComponent}
                        windowSize={20} // 控制渲染窗口为5个items
                        maxToRenderPerBatch={30} // 每批次渲染的最大数量
                        updateCellsBatchingPeriod={50} // 批量渲染的时间窗口
                        // removeClippedSubviews={true} // 移除屏幕外的视图
                        initialNumToRender={10} // 初始渲染数量
                        // getItemLayout={getItemLayout} // 固定高度布局
                    />
                </GestureHandlerRootView>
            </LinearGradient>
        </HomeContext.Provider>
    );
}

function EmptyListComponent() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-lg">暂无数据</Text>
            <Text className="text-gray-400 mt-2">请去设置添加Avatar数据</Text>
        </View>
    );
}

export default observer(HomeScreen);
