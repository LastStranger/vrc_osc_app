import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import Animated, {
    Easing,
    FadeIn,
    FadeOut, interpolateColor,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import { Stagger } from "@animatereactnative/stagger";
import { useNavigation } from "expo-router";
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

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
    //
    // const borderOpacity = useSharedValue(0.5);
    //
    // useEffect(() => {
    //     borderOpacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    // }, []);
    //
    // const animatedBorderStyle = useAnimatedStyle(() => ({
    //     borderColor: `rgba(0, 255, 255, ${borderOpacity.value})`,
    // }));

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(360, { duration: 3000, easing: Easing.linear }),
            -1, // 无限循环
            false
        );
    }, []);

    // 旋转动画
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${progress.value}deg` }],
        };
    });

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
            <Stagger
                initialEnteringDelay={1000}
                duration={500}
                stagger={100}
                style={{ flex: 0.5, justifyContent: "flex-end", alignItems: "center" }}
            >
                {/*<Animated.View*/}
                {/*    className="p-4 bg-black border-2 rounded-lg shadow-lg"*/}
                {/*    style={[animatedBorderStyle]}*/}
                {/*>*/}
                {/*    <Text className="text-white text-2xl font-bold mb-2">Animate Borders</Text>*/}
                {/*    <Text className="text-gray-300">*/}
                {/*        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ad exercitationem voluptatem ullam et, natus impedit quae veniam optio a doloremque officiis beatae.*/}
                {/*    </Text>*/}
                {/*</Animated.View>*/}

            <View style={styles.container}>
                <MaskedView
                    style={styles.maskedWrapper}
                    maskElement={
                        <View style={styles.mask}>
                            <View style={styles.maskInner} />
                        </View>
                    }
                >
                    {/* 旋转的渐变背景 */}
                    <Animated.View style={[styles.gradientWrapper, animatedStyle]}>
                        <LinearGradient
                            colors={['#ff4545', '#00ff99', '#006aff', '#ff0095', '#ff4545']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradient}
                        />
                    </Animated.View>
                </MaskedView>

                {/* 按钮 */}
                <Pressable style={styles.button} onPress={handleGoToHome}>
                    <Text style={styles.text}>欢迎</Text>
                </Pressable>
            </View>
            </Stagger>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 1,
        // backgroundColor: '#0b0d15',
    },
    maskedWrapper: {
        width: 160,
        height: 60,
        position: 'absolute',
    },
    mask: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    maskInner: {
        width: 160,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 30,
    },
    gradientWrapper: {
        width: 200,
        height: 200,
        position: 'absolute',
        alignSelf: 'center',
        top: -100,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: '#1c1f2b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        position: 'absolute',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});
