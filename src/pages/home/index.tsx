import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";
import { LinearGradient } from "expo-linear-gradient";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { DataT, HomeContextT } from "@/store/types";
import OperateItem from "@/components/Home/OperateItem";
import HomeStore from "@/store/homeStore";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/store/context";

export const HomeContext = createContext<HomeContextT>({} as any);

function HomeScreen() {
    const rootStore = useContext(StoreContext);
    const store = useMemo(() => new HomeStore(rootStore!), [rootStore]);
    const contextValue = useMemo(() => ({ store }), [store]);

    useEffect(() => {
        return () => {
            store.dispose();
        };
    }, [store]);

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
                <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                    <LegendList
                        maintainVisibleContentPosition
                        recycleItems={true}
                        className="flex-1"
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyExtractor={(item: DataT) => item.name}
                        onScroll={handleScroll}
                        data={store.oscArr}
                        renderItem={renderItem}
                        ListEmptyComponent={EmptyListComponent}
                    />
                </SafeAreaView>
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
