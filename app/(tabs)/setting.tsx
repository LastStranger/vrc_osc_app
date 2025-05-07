import { observer } from "mobx-react-lite";
import React, { useCallback, useContext } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StoreContext } from "@/app/_layout";

const Setting = () => {
    const store = useContext(StoreContext);
    //todo保存配置,笔记在notion上

    // 处理地址输入变化
    const handleAddressChange = useCallback((text: string) => {
        store?.setAddress(text);
    }, [store]);

    // 处理端口输入变化
    const handlePortChange = useCallback((text: string) => {
        store?.setPortOut(text);
    }, [store]);

    // 处理 Avatar JSON 数据的输入变化
    const handleAvatarJson = useCallback((text: string) => {
        store?.setAvatarJson(text);
    }, [store]);

    // 加载示例 Avatar 1
    const handleDemoAvatar = useCallback(() => {
        store?.setDemo1Avatar();
    }, [store]);

    // 加载示例 Avatar 2
    const handleDemo2Avatar = useCallback(() => {
        store?.setDemo2Avatar();
    }, [store]);

    return (
        <ScrollView className="">
            {/* 设置表单容器 */}
            <View className="bg-white rounded-lg mt-3 mx-4 pl-4">
                {/* 地址输入区域 */}
                <View className="flex-row items-center py-4 pr-4 border-b border-b-gray-200">
                    <Text className="text-black w-[20%] text-[16px] ">地址</Text>
                    <TextInput
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1"
                        placeholder="必填, 域名或者IP"
                        value={store?.address}
                        onChangeText={handleAddressChange}
                    />
                </View>
                {/* 端口输入区域 */}
                <View className="flex-row items-center py-4 pr-4 border-b border-b-gray-200">
                    <Text className="text-black w-[20%] text-xl ">端口</Text>
                    <TextInput
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1"
                        placeholder="必填, 1-65535"
                        value={store?.portOut}
                        onChangeText={handlePortChange}
                    />
                </View>
                {/* Avatar JSON 输入区域 */}
                <View className="flex-row items-center py-4 pr-4">
                    <Text className="text-black w-[20%] text-xl ">Avatar</Text>
                    <TextInput
                        multiline
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1 max-h-[200] min-h-[100] bg-gray-100"
                        placeholder="将avatar的json数据粘贴到此处"
                        value={store?.avatarInputString}
                        onChangeText={handleAvatarJson}
                    />
                </View>
            </View>
            {/* 示例按钮区域 */}
            <View className="flex-row justify-between mt-6 mx-4">
                <TouchableOpacity
                    className="bg-[#80C7FF] px-6 py-3 rounded-full w-[45%]"
                    onPress={handleDemoAvatar}
                >
                    <Text className="text-white text-center text-[16px] font-medium">
                        demo Avatar1
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-[#A3C8FF] px-6 py-3 rounded-full w-[45%]"
                    onPress={handleDemo2Avatar}
                >
                    <Text className="text-white text-center text-[16px] font-medium">
                        demo Avatar2
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default observer(Setting);