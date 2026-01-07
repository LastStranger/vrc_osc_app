import React, { useState } from "react";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";



interface LanguageDropdownProps {
    selected: string;
    onSelect: (value: string) => void;
    label: string;
    zIndex: number;
}


// 语言选项配置
const LANGUAGES = [
    { label: "中文", value: "zh" },
    { label: "English", value: "en" },
    { label: "日本語", value: "ja" },
    { label: "한국어", value: "ko" },
    { label: "Español", value: "es" },
    { label: "Русский", value: "ru" },
    { label: "Français", value: "fr" },
];

const LanguageDropdown = ({ selected, onSelect, label, zIndex }: LanguageDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        toggleDropdown();
    };


    const selectedLabel = LANGUAGES.find((l) => l.value === selected)?.label || selected;

    return (
        <View className="flex-1" style={{ zIndex }}>
            <Text className="text-gray-500 mb-2 font-medium">{label}</Text>
            <View style={{ zIndex: zIndex + 1 }}>
                <Pressable
                    onPress={toggleDropdown}
                    className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                    <Text className="text-base text-gray-800">{selectedLabel}</Text>
                    <MaterialIcons
                        name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color="#666"
                    />
                </Pressable>

                {isOpen && (
                    <Animated.View
                        entering={FadeInDown.duration(300).springify()}
                        exiting={FadeOutUp.duration(300)}
                        style={[
                            {
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                backgroundColor: "white",
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: "#e5e7eb",
                                marginTop: 4,
                                overflow: "hidden",
                                elevation: 5,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                            },
                        ]}
                    >
                        <Animated.ScrollView
                            showsVerticalScrollIndicator={false}
                            className="py-1"
                        >
                            {LANGUAGES.map((lang, index) => (
                                <Pressable
                                    key={lang.value}
                                    onPress={() => handleSelect(lang.value)}
                                    className={`px-3 py-2.5 ${selected === lang.value ? "bg-blue-50" : "active:bg-gray-50"
                                        }`}
                                >
                                    <Text
                                        className={`text-base ${selected === lang.value ? "text-blue-600 font-medium" : "text-gray-700"
                                            }`}
                                    >
                                        {lang.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </Animated.ScrollView>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

export default LanguageDropdown;