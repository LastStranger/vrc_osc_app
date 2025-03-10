import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import Animated, { runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated";

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

    useAnimatedReaction(
        () => {
            const floatIndex = (offset.value / _itemSize) % images.length;
            return Math.abs(Math.floor(floatIndex));
        },
        (value) => {
            runOnJS(setActIndex)(value);
        },
    );

    const renderItems = useCallback(({ item }: any) => {
        // return <Image style={{width: 100, height: 100}} source={item} />;
        return <Image className="rounded-[16]" style={{ width: _itemWidth, height: _itemHeight }} source={item} />;
        // return <Text>{111}</Text>;
    }, []);

    return (
        <View className="flex-1 bg-red-500 items-center justify-center">
            <View style={[StyleSheet.absoluteFillObject]}>
                <Animated.Image key={images[actIndex]} className="flex-1" source={images[actIndex]} />
            </View>
            <Marquee speed={3} spacing={_spacing} position={offset}>
                <FlatList keyExtractor={(item, index) => index.toString()} contentContainerStyle={{ gap: _spacing }} horizontal data={images} renderItem={renderItems} />
            </Marquee>
        </View>
    );
};

export default Index;
