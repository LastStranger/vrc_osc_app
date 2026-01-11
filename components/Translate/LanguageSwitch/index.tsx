import React, { useCallback, useContext, useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import LanguageDropdown from "./LanguageDropdown";
import { observer } from "mobx-react-lite";
import { TranslateContext } from "@/components/Translate/context";

const Index = () => {
    const { store } = useContext(TranslateContext);
    // const [sourceLang, setSourceLang] = useState("zh");
    // const [targetLang, setTargetLang] = useState("en");
    //
    // const swapLanguages = () => {
    //     setSourceLang(targetLang);
    //     setTargetLang(sourceLang);
    // };

    const swapLanguages = useCallback(() => {
        let tempLang = store.sourceLang;
        store.changeSourceLang(store.targetLang);
        store.changeTargetLang(tempLang);
    }, [store.targetLang, store.sourceLang]);

    const handleChangeSourceLang = useCallback((val: string) => {
        store.changeSourceLang(val);
    }, []);

    const handleChangeTargetLang = useCallback((val: string) => {
        store.changeTargetLang(val);
    }, []);

    return (
        <View className="bg-white rounded-[18px] p-4 mx-4 my-3 shadow-sm justify-end self-stretch">
            <View className="flex-row items-end justify-between z-50">
                {/* Source Language */}
                <LanguageDropdown
                    label="源语言"
                    selected={store.sourceLang}
                    onSelect={handleChangeSourceLang}
                    zIndex={20}
                />

                {/* Swap Button */}
                <View className="mx-3 mb-1 z-10">
                    <Pressable
                        onPress={swapLanguages}
                        className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center active:bg-gray-200"
                    >
                        <MaterialIcons name="swap-horiz" size={24} color="#666" />
                    </Pressable>
                </View>

                {/* Target Language */}
                <LanguageDropdown
                    label="目标语言"
                    selected={store.targetLang}
                    onSelect={handleChangeTargetLang}
                    zIndex={20}
                />
            </View>
        </View>
    );
};

export default observer(Index);
