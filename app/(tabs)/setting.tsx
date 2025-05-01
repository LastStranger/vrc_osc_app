import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import RootStore from "@/store/rootStore";
import { StoreContext } from "@/app/_layout";

const Setting = () => {
    const store = useContext(StoreContext);

    const handleAddressChange = (text: string) => {
        store?.setAddress(text);
    }

    const handlePortChange = (text: string) => {
        store?.setPortOut(text);
    }

    return (
        <ScrollView className="">
            <View className="bg-white rounded-lg mt-3 mx-4 pl-4">
                <View className="flex-row items-center py-4 pr-4 border-b border-b-gray-200">
                    <Text className="text-black w-[20%] text-[16px] ">地址</Text>
                    <TextInput
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1"
                        placeholder="必填, 域名或者IP"
                        // style={{textAlignVertical: "center",margin: 0, padding: 0}}
                        value={store?.address}
                        onChangeText={handleAddressChange}
                    />
                </View>
                <View className="flex-row items-center py-4 pr-4 border-b border-b-gray-200">
                    <Text className="text-black w-[20%] text-xl ">端口</Text>
                    <TextInput
                        className="text-[16px] m-0 p-0 text-[#4c4c4c] flex-1"
                        placeholder="必填, 1-65535"
                        // style={{textAlignVertical: "center",margin: 0, padding: 0}}
                        value={store?.portOut}
                        onChangeText={handlePortChange}
                    />
                </View>
            </View>
        </ScrollView>
    );
};
export default observer(Setting);