import {Image, StyleSheet, Platform, TouchableOpacity, Text, NativeEventEmitter} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useEffect, useState} from "react";
// @ts-ignore
import osc from 'react-native-osc';


export default function HomeScreen() {
    const [data, setData] = useState<any>(undefined);

    useEffect(() => {
        console.log(1);
        console.log(2);
        console.log(3);
        console.log(4);
        console.log(5);

    }, []);

    useEffect(() => {
        const eventEmitter = new NativeEventEmitter(osc);

        eventEmitter.addListener("GotMessage", (oscMessage) => {
            console.warn("message: ", oscMessage);
            if(oscMessage?.address === "/avatar/change"){
                setData(oscMessage.data?.[0]);
            }
            // setData(oscMessage);
        });

        try {
            osc.createServer("", 9001);
            console.log('OSC server created successfully');
        } catch (error) {
            console.error('Error creating OSC server:', error);
        }
    }, []);

    useEffect(() => {
        const portOut = 9000;
// //OSC server IP address like "192.168.1.80" or "localhost"
//         const address = "192.168.31.180";
        const address = "192.168.31.180";
//
// //create the client only once in componentDidMount
        osc.createClient(address, portOut);

//now you can send OSC messages like this (only after creating a client)
//         osc.sendMessage("/address/", [1.0, 0.5]);

//send any combination of integers, floats, bool & string values:
//         osc.sendMessage("/address/", ["string value", 1, false, 0.5]);
//         osc.sendMessage("/input/Horizontal/",)
//         osc.sendMessage("/input/Jump")

    }, []);

    const handleJump = (param: number) => {
        osc.sendMessage("/input/Jump", [param])
        console.log("sendMessage");
    }

    const handleAnimate = () => {
        // osc.sendMessage("/avatar/parameters/VRCEmote")
        osc.sendMessage("/avatar/parameters/AFK", true);
        osc.sendMessage("/avatar/parameters/Horns", [false]);
        osc.sendMessage("/avatar/parameters/Sword", [true]);
    }
    const handleAnimate2 = () => {
        // osc.sendMessage("/avatar/parameters/VRCEmote")
        osc.sendMessage("/avatar/parameters/AFK", ["True"]);
        osc.sendMessage("/avatar/parameters/Horns", [true]);
        osc.sendMessage("/avatar/parameters/Sword", [false]);
    }

    const handleAnimate3 = () => {
        // osc.sendMessage("/avatar/parameters/VRCEmote")
        // osc.sendMessage("/avatar/parameters/AFK", ["True"]);
        osc.sendMessage("/avatar/parameters/AFK", [true]);
        // osc.sendMessage("/avatar/parameters/AFK", [true]);
        // osc.sendMessage("/avatar/parameters/Horns", [true]);
        // osc.sendMessage("/avatar/parameters/VRCEmote", [1]);
    }


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">The first step of making vrchat's OSC</ThemedText>
        <HelloWave />
      </ThemedView>
        <Text className="text-5xl bg-red-500">22222</Text>
        <TouchableOpacity style={{width: "100%", height: 50, backgroundColor: "red"}} onPressIn={() => handleJump(1)} onPressOut={() => handleJump(0)}>
            <Text>Jump</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width: "100%", height: 50, backgroundColor: "red"}} onPress={handleAnimate}>
            <Text>animate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width: "100%", height: 50, backgroundColor: "red"}} onPress={handleAnimate2}>
            <Text>animate2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width: "100%", height: 50, backgroundColor: "red"}} onPress={handleAnimate3}>
            <Text>animate3</Text>
        </TouchableOpacity>
      <ThemedView style={styles.stepContainer}>
          <Text>{data}</Text>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
