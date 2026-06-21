import { observer } from "mobx-react-lite";
import React, { useCallback, useContext } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, Switch } from "react-native";
import { StoreContext } from "@/app/_layout";
import { Sitemap, useNavigation, useRouter } from "expo-router";

const Setting = () => {
    const store = useContext(StoreContext);
    const router = useRouter();
    //todo保存配置,笔记在notion上

    // 处理地址输入变化
    const handleAddressChange = useCallback(
        (text: string) => {
            store?.setAddress(text);
        },
        [store],
    );

    // 处理端口输入变化
    const handlePortChange = useCallback(
        (text: string) => {
            const portNumber = parseInt(text);
            if (!isNaN(portNumber) && portNumber > 0 && portNumber <= 65535) {
                store?.setPortOut(portNumber);
            } else {
                Alert.alert("输入错误", "请输入有效的数字", [{ text: "确定" }]);
            }
        },
        [store],
    );

    // 处理接收端口输入变化
    const handlePortInChange = useCallback(
        (text: string) => {
            const portNumber = parseInt(text);
            if (!isNaN(portNumber) && portNumber > 0 && portNumber <= 65535) {
                store?.setPortIn(portNumber);
            } else {
                Alert.alert("输入错误", "请输入有效的数字", [{ text: "确定" }]);
            }
        },
        [store],
    );

    // 处理 Avatar JSON 数据的输入变化
    const handleAvatarJson = useCallback(
        (text: string) => {
            store?.setAvatarJson(text);
        },
        [store],
    );

    // 处理 Tencent Secret ID 修改
    const handleTencentSecretIdChange = useCallback(
        (text: string) => {
            store?.setTencentSecretId(text);
        },
        [store],
    );

    // 处理 Tencent Secret Key 修改
    const handleTencentSecretKeyChange = useCallback(
        (text: string) => {
            store?.setTencentSecretKey(text);
        },
        [store],
    );

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
                    <Text className="text-black w-[20%] text-xl ">发送端口</Text>
                    <TextInput
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1"
                        placeholder="必填, 1-65535"
                        value={store?.portOut?.toString()}
                        keyboardType="number-pad"
                        onChangeText={handlePortChange}
                    />
                </View>
                {/* 接收端口输入区域 */}
                <View className="flex-row items-center py-4 pr-4 border-b border-b-gray-200">
                    <Text className="text-black w-[20%] text-xl ">接收端口</Text>
                    <TextInput
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1"
                        placeholder="必填, 1-65535"
                        value={store?.portIn?.toString()}
                        keyboardType="number-pad"
                        onChangeText={handlePortInChange}
                    />
                </View>
                {/* Tencent SecretId */}
                <View className="flex-row items-center py-4 pr-4 border-b border-b-gray-200">
                    <Text className="text-black w-[20%] text-[16px] ">SecretId</Text>
                    <TextInput
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1"
                        placeholder="腾讯云 SecretId"
                        value={store?.tencentSecretId}
                        onChangeText={handleTencentSecretIdChange}
                    />
                </View>
                {/* Tencent SecretKey */}
                <View className="flex-row items-center py-4 pr-4 border-b border-b-gray-200">
                    <Text className="text-black w-[20%] text-[16px] ">SecretKey</Text>
                    <TextInput
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1"
                        placeholder="腾讯云 SecretKey"
                        value={store?.tencentSecretKey}
                        secureTextEntry
                        onChangeText={handleTencentSecretKeyChange}
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
                <TouchableOpacity className="bg-[#80C7FF] px-6 py-3 rounded-full w-[45%]" onPress={handleDemoAvatar}>
                    <Text className="text-white text-center text-[16px] font-medium">demo Avatar1</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-[#A3C8FF] px-6 py-3 rounded-full w-[45%]" onPress={handleDemo2Avatar}>
                    <Text className="text-white text-center text-[16px] font-medium">demo Avatar2</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                className="bg-[#A3C8FF] px-6 py-3 rounded-full w-[45%] mt-4 mx-4"
                onPress={() => {
                    router.push("/_justTemp/demo");
                }}
            >
                <Text className="text-white text-center text-[16px] font-medium">demo Avatar2</Text>
            </TouchableOpacity>

            {/* OSC 消息接收器 */}
            <View className="bg-white rounded-lg mt-6 mx-4 px-4 py-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 pr-4">
                        {/* 状态圆点 */}
                        <View className={`w-3.5 h-3.5 rounded-full mr-3 ${store?.oscListenerActive ? "bg-green-500" : "bg-gray-400"}`} />
                        <View className="flex-1">
                            <Text className="text-black text-[16px] font-medium">OSC 消息接收器</Text>
                            <Text className="text-gray-500 text-[12px]">监听来自 VRChat ({store?.portIn} 端口) 的消息</Text>
                        </View>
                    </View>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={store?.oscListenerActive ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => store?.toggleOscListener()}
                        value={store?.oscListenerActive}
                    />
                </View>

                {store?.oscListenerActive && (
                    <View className="mt-4 bg-gray-950 rounded-lg p-3 h-[180]">
                        <Text className="text-green-400 text-[12px] font-mono mb-2 border-b border-gray-800 pb-1">
                            Live Logs:
                        </Text>
                        {store?.lastOscMessages && store.lastOscMessages.length > 0 ? (
                            <ScrollView className="flex-1" nestedScrollEnabled={true}>
                                {store.lastOscMessages.map((msg) => (
                                    <View key={msg.id} className="flex-row py-1 border-b border-gray-900">
                                        <Text className="text-gray-500 text-[11px] font-mono mr-2">{msg.time}</Text>
                                        <Text className="text-blue-400 text-[11px] font-mono flex-1 mr-2" numberOfLines={1} ellipsizeMode="tail">{msg.address}</Text>
                                        <Text className="text-yellow-300 text-[11px] font-mono">{JSON.stringify(msg.data)}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-gray-500 text-[12px] font-mono">等待接收 OSC 消息...</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* 自动掏枪触发 */}
            <View className="bg-white rounded-lg mt-6 mx-4 px-4 py-4 flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                    <Text className="text-black text-[16px] font-medium">右手手势掏枪触发</Text>
                    <Text className="text-gray-500 text-[12px]">检测到右手手势（GestureRight）值为 6 时，自动发送 openGun 开启散弹枪</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={store?.autoDrawGunEnabled ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => store?.toggleAutoDrawGun()}
                    value={store?.autoDrawGunEnabled}
                />
            </View>

            {/* 临时功能：头发换色跑马灯 */}
            <View className="bg-white rounded-lg mt-6 mx-4 px-4 py-4 flex-row items-center justify-between">
                <View>
                    <Text className="text-black text-[16px] font-medium">头发换色跑马灯</Text>
                    <Text className="text-gray-500 text-[12px]">自动循环发送 OSC 消息 (0-100%)</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={store?.hairColorMarqueeActive ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => store?.toggleHairColorMarquee()}
                    value={store?.hairColorMarqueeActive}
                />
            </View>

            {/* 临时功能：妩媚的猫姿态 */}
            <View className="bg-white rounded-lg mt-6 mx-4 px-4 py-4 flex-row items-center justify-between">
                <View>
                    <Text className="text-black text-[16px] font-medium">妩媚的猫 (姿态)</Text>
                    <Text className="text-gray-500 text-[12px]">发送 OSC Tracker 消息模拟猫趴姿态</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={store?.catPoseActive ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => store?.toggleCatPose()}
                    value={store?.catPoseActive}
                />
            </View>
            {/* 临时功能：自动眨眼 */}
            <View className="bg-white rounded-lg mt-6 mx-4 px-4 py-4 flex-row items-center justify-between mb-8">
                <View>
                    <Text className="text-black text-[16px] font-medium">自动眨眼 (OSC Eye)</Text>
                    <Text className="text-gray-500 text-[12px]">利用眼动追踪 OSC 每3秒自动眨眼</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={store?.blinkActive ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => store?.toggleBlink()}
                    value={store?.blinkActive}
                />
            </View>

            {/*{Sitemap()}*/}
        </ScrollView>
    );
};

export default observer(Setting);
