import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import Animated, { FadeIn, FadeOut, runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { Stagger } from "@animatereactnative/stagger";
import { useNavigation } from "expo-router";

cssInterop(Image, { className: "style" });

const { width, height } = Dimensions.get("window");
// const _itemWidth = width * 0.62;
// const _itemHeight = _itemWidth * 1.67;
const _itemWidth = width;
const _itemHeight = _itemWidth * (9 / 16);
const _spacing = 16;
const _itemSize = _itemWidth + _spacing;
const images = [
    require("@/assets/images/welcome/1.png"),
    require("@/assets/images/welcome/2.png"),
    require("@/assets/images/welcome/3.png"),
    require("@/assets/images/welcome/4.png"),
    require("@/assets/images/welcome/5.png"),
];

const Index = () => {
    const offset = useSharedValue(0);
    const [actIndex, setActIndex] = useState(1);
    const navigation = useNavigation<any>();

    useAnimatedReaction(
        () => {
            const floatIndex = ((offset.value + width / 2) / _itemSize) % images.length;
            return Math.abs(Math.floor(floatIndex));
        },
        value => {
            runOnJS(setActIndex)(value);
        },
    );

    const handleGoToHome = useCallback(() => {
        navigation.navigate("(tabs)");
    }, []);

    const renderItems = useCallback(({ item }: any) => {
        // return <Image style={{width: 100, height: 100}} source={item} />;
        return <Image className="rounded-[16]" style={{ width: _itemWidth, height: _itemHeight }} source={item} />;
        // return <Text>{111}</Text>;
    }, []);

    return (
        <View className="flex-1 items-center justify-center bg-black">
            <Animated.View
                key={`iamge-${actIndex}`}
                style={[StyleSheet.absoluteFillObject]}
                entering={FadeIn.duration(1000)}
                exiting={FadeOut.duration(1000)}
            >
                <Image className="flex-1" blurRadius={50} source={images[actIndex]} />
            </Animated.View>
            <Marquee speed={2} spacing={_spacing} position={offset}>
                <FlatList
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ gap: _spacing }}
                    horizontal
                    data={images}
                    renderItem={renderItems}
                />
            </Marquee>
            <Stagger initialEnteringDelay={1000} duration={500} stagger={100} style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={handleGoToHome}>
                    <Text className="text-white">欢迎</Text>
                </TouchableOpacity>
            </Stagger>
        </View>
    );
};

export default Index;
