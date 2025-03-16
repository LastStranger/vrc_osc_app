import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet, Pressable } from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    runOnJS,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { Stagger } from "@animatereactnative/stagger";
import { useNavigation } from "expo-router";

import { Canvas, Rect, SweepGradient, vec, Skia } from "@shopify/react-native-skia";

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
    const angle = useSharedValue(0);

    useEffect(() => {
        angle.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1);
    }, []);

    // 绑定 Reanimated 的动画值到 Skia
    const aTransform = useDerivedValue(() => ([
        { rotate: (angle.value * Math.PI) / 180 },
    ]));

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
        navigation.replace("(tabs)");
    }, []);

    const renderItems = useCallback(({ item }: any) => {
        // return <Image style={{width: 100, height: 100}} source={item} />;
        return <Image className="rounded-[16]" style={{ width: _itemWidth, height: _itemHeight }} source={item} />;
    }, []);

    console.log("rendering");

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
            <Stagger
                initialEnteringDelay={1000}
                duration={500}
                stagger={100}
                style={{ flex: 0.5, justifyContent: "flex-end", alignItems: "center" }}
            >

                <View style={styles.container}>
                    <Canvas style={styles.canvas}>
                        {/* 画渐变边框 */}
                        <Rect x={0} y={0} width={160} height={160}>
                            <SweepGradient
                                c={vec(80, 40)}
                                origin={{x:80, y: 40}}
                                colors={["#ff4545", "#00ff99", "#006aff", "#ff0095", "#ff4545"]}
                                // positions={[0, 0.25, 0.5, 0.75, 1]}
                                transform={aTransform}
                            />
                        </Rect>
                    </Canvas>

                    <Pressable style={styles.button} onPress={handleGoToHome}>
                        <Text style={styles.text}>点击我</Text>
                    </Pressable>
                </View>
            </Stagger>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#0b0d15",
    },
    canvas: {
        width: 160,
        height: 60,
        position: "absolute",
        borderRadius: 10,
        overflow: "hidden",
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: "#1c1f2b",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        position: "absolute",
    },
    text: {
        color: "white",
        fontSize: 16,
    },
});
