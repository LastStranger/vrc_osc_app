import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// 初始化录音对象
// let recording = new Audio.Recording();

// 开始录音
export const startRecording = async () => {
    const recording = new Audio.Recording();
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
    });
    try {
        await recording.prepareToRecordAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        await recording.startAsync();
        return recording;
    } catch (error) {
        console.error('录音失败:', error);
    }
};

// 停止录音并获取音频文件
export const stopRecording = async (recording: Audio.Recording) => {
    try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        // 读取音频文件为Base64格式（腾讯云ASR需要）
        const audioBase64 = await FileSystem.readAsStringAsync(uri ?? "", {
            encoding: FileSystem.EncodingType.Base64,
        });
        return audioBase64;
    } catch (error) {
        console.error('停止录音失败:', error);
    }
};