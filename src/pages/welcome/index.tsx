import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet, Pressable } from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import Animated, {
    cancelAnimation,
    Easing,
    FadeIn,
    FadeOut,
    useAnimatedReaction,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";
import { Stagger } from "@animatereactnative/stagger";
import { useRouter } from "expo-router";
import { storage } from "@/store/mmkv";

import { Canvas, SweepGradient, vec, BlurMask, RoundedRect } from "@shopify/react-native-skia";

cssInterop(Image, { className: "style" });

const { width } = Dimensions.get("window");
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

const Welcome = () => {
    const offset = useSharedValue(0);
    const [actIndex, setActIndex] = useState(1);
    const router = useRouter();
    const angle = useSharedValue(0);

    useEffect(() => {
        // 放到UI线程中,防止热更新导致动画没重新热更新
        scheduleOnUI(() => {
            cancelAnimation(angle);
            angle.value = withRepeat(withTiming(Math.PI * 2, { duration: 2000, easing: Easing.linear }), -1, false);
        });

        return () => {
            cancelAnimation(angle);
        };
    }, []);

    // 绑定 Reanimated 的动画值到 Skia
    const aTransform = useDerivedValue(() => [{ rotate: angle.value }]);

    useAnimatedReaction(
        () => {
            const floatIndex = ((offset.value + width / 2) / _itemSize) % images.length;
            return Math.abs(Math.floor(floatIndex));
        },
        value => {
            scheduleOnRN(setActIndex, value);
        },
    );

    const handleGoToHome = useCallback(() => {
        storage.set("hasSeenWelcome", true);
        router.replace("/(tabs)");
    }, [router]);

    const renderItems = useCallback(({ item }: any) => {
        return (
            <Image
                className="rounded-[16]"
                style={{ width: _itemWidth, height: _itemHeight }}
                source={item}
                cachePolicy="memory-disk"
            />
        );
    }, []);

    return (
        <View className="flex-1 items-center justify-center bg-black">
            <Animated.View
                key={`iamge-${actIndex}`}
                style={[StyleSheet.absoluteFillObject]}
                entering={FadeIn.duration(1000)}
                exiting={FadeOut.duration(1000)}
            >
                <Image className="flex-1" blurRadius={50} source={images[actIndex]} cachePolicy="memory-disk" />
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

            {/*让底部部分依次上浮动画*/}
            <Stagger
                initialEnteringDelay={1000}
                duration={500}
                stagger={100}
                style={{ flex: 0.5, justifyContent: "flex-end", alignItems: "center" }}
            >
                <View style={styles.container}>
                    <Canvas style={styles.canvas}>
                        {/* 画渐变边框 */}
                        <RoundedRect
                            x={20}
                            y={20}
                            width={160}
                            height={60}
                            r={30}
                        >
                            <SweepGradient
                                c={vec(100, 50)}
                                origin={{ x: 100, y: 50 }}
                                colors={["#ff4545", "#00ff99", "#006aff", "#ff0095", "#ff4545"]}
                                transform={aTransform}
                            />
                            <BlurMask blur={8} style={"solid"} />
                        </RoundedRect>
                    </Canvas>

                    <Pressable style={styles.button} onPress={handleGoToHome}>
                        <Text style={styles.text}>点击我</Text>
                    </Pressable>
                </View>
            </Stagger>
        </View>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 200,
    },
    canvas: {
        width: 200,
        height: 200,
        position: "absolute",
        borderRadius: 30,
        overflow: "hidden",
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: "#1c1f2b",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        position: "absolute",
        top: 25,
    },
    text: {
        color: "white",
        fontSize: 16,
    },
});
