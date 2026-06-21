import { makeAutoObservable } from "mobx";
import { storage } from "@/store/mmkv";
import oscDataDemo1 from "@/app/(tabs)/data.json";
import oscDataDemo2 from "@/app/(tabs)/dataBlue.json";
import { DataT } from "@/store/types";
import osc from "react-native-vrc-osc";
import ExpoVrcOscIntentModule from "expo-vrc-osc-intent";
import { NativeEventEmitter, TurboModuleRegistry } from "react-native";

export class RootStore {
    address: string = storage.getString("address") ?? "192.168.0.1"; // vrc的IP地址
    portOut: number = storage.getNumber("portOut") ?? 9000; // vrc的端口号
    avatarInfo?: DataT[] = [];
    avatarInputString?: string = undefined;
    tencentSecretId: string = storage.getString("tencentSecretId") ?? "";
    tencentSecretKey: string = storage.getString("tencentSecretKey") ?? "";

    hairColorMarqueeActive: boolean = false;
    private hairColorTimer: any = null;

    catPoseActive: boolean = false;
    private catPoseTimer: any = null;

    blinkActive: boolean = false;
    private blinkTimer: any = null;
    private blinkInternalTimer: any = null;
    private currentEyesClosed: number = 0.00001;

    portIn: number = storage.getNumber("portIn") ?? 9001; // vrc 接收端口号
    oscListenerActive: boolean = storage.getBoolean("oscListenerActive") ?? false; // 是否开启 OSC 监听
    lastOscMessages: Array<{ id: string; address: string; data: any[]; time: string }> = []; // 最近接收到的 OSC 消息
    private oscSubscription: any = null;
    autoDrawGunEnabled: boolean = storage.getBoolean("autoDrawGunEnabled") ?? false; // 是否开启右手手势掏枪触发

    constructor() {
        makeAutoObservable(
            this,
            {},
            {
                autoBind: true, // 自动绑定方法
            },
        );
        osc.createClient(this.address, this.portOut);
        // 初始化时，将地址和端口同步给 Swift 侧
        try {
            ExpoVrcOscIntentModule.saveConfig(this.address, this.portOut);
        } catch (error) {
            console.error("同步 OSC 配置到 Native 失败:", error);
        }
        this.initAvatarInfo();

        // 如果开启了 OSC 监听，则初始化时启动
        if (this.oscListenerActive) {
            this.startOscListener();
        }
    }

    initAvatarInfo = () => {
        const avatarInfo = storage.getString("avatarInfo");
        if (avatarInfo) {
            this.avatarInfo = JSON.parse(avatarInfo);
        }
    };

    // 设置地址和端口的方法
    setAddress = (address: string) => {
        this.address = address;
        storage.set("address", address);
        try {
            ExpoVrcOscIntentModule.saveConfig(address, this.portOut);
        } catch (error) {
            console.error("更新 OSC 地址到 Native 失败:", error);
        }
    };

    setPortOut = (portOut: number) => {
        this.portOut = portOut;
        storage.set("portOut", portOut);
        try {
            ExpoVrcOscIntentModule.saveConfig(this.address, portOut);
        } catch (error) {
            console.error("更新 OSC 端口到 Native 失败:", error);
        }
    };

    setTencentSecretId = (id: string) => {
        this.tencentSecretId = id;
        storage.set("tencentSecretId", id);
    };

    setTencentSecretKey = (key: string) => {
        this.tencentSecretKey = key;
        storage.set("tencentSecretKey", key);
    };

    setAvatarJson = (avatarJson?: unknown) => {
        try {
            this.avatarInputString = avatarJson as string;
            // 类型守卫
            if (!avatarJson || typeof avatarJson !== "string") {
                console.warn("无效的 avatarJson 输入");
                return;
            }

            // 解析 JSON 并进行类型验证
            const parsed = JSON.parse(avatarJson);

            if (!parsed || !Array.isArray(parsed.parameters)) {
                console.warn("JSON 格式不正确或缺少 parameters 数组");
                return;
            }

            // // 验证数据结构
            // const isValidDataT = (data: unknown): data is DataT => {
            //     if (!data || typeof data !== 'object') return false;
            //     const item = data as Partial<DataT>;
            //     return (
            //         typeof item.name === 'string' &&
            //         item.input &&
            //         typeof item.input.address === 'string' &&
            //         item.input.type === 'Bool'
            //     );
            // };

            const parameters = parsed.parameters;
            // if (!parameters.every(isValidDataT)) {
            //     console.warn('parameters 数组中包含无效数据');
            //     return;
            // }

            this.avatarInfo = parameters;
            storage.set("avatarInfo", JSON.stringify(parameters));
        } catch (error) {
            console.error("解析 avatarJson 时出错:", error);
            this.avatarInfo = [];
        }
    };

    setDemo1Avatar = () => {
        this.avatarInfo = oscDataDemo1?.parameters as DataT[];
        this.avatarInputString = JSON.stringify(oscDataDemo1);
    };

    setDemo2Avatar = () => {
        this.avatarInfo = oscDataDemo2.parameters as DataT[];
        this.avatarInputString = JSON.stringify(oscDataDemo2);
    };

    toggleHairColorMarquee = () => {
        this.hairColorMarqueeActive = !this.hairColorMarqueeActive;
        if (this.hairColorMarqueeActive) {
            let value = 0;
            let direction = 1;
            this.hairColorTimer = setInterval(() => {
                value += 0.05 * direction; // 每次变动 0.05
                if (value >= 1) {
                    value = 1;
                    direction = -1;
                } else if (value <= 0) {
                    value = 0;
                    direction = 1;
                }
                // 发送 OSC 消息，地址使用用户提供的 /avatar/parameters/头发换色
                // console.warn(value, "value");
                // osc.sendMessage("/avatar/parameters/\u5934\u53d1\u6362\u8272", [value]);
                osc.sendMessage("/avatar/parameters/\\u5934\\u53d1\\u6362\\u8272", [value]);
            }, 50); // 100ms 发送一次
        } else {
            if (this.hairColorTimer) {
                clearInterval(this.hairColorTimer);
                this.hairColorTimer = null;
            }
            osc.sendMessage("/avatar/parameters/\\u5934\\u53d1\\u6362\\u8272", [0]);
        }
    };

    toggleCatPose = () => {
        this.catPoseActive = !this.catPoseActive;
        if (this.catPoseActive) {
            const floatify = (n: number) => (n === 0 ? 0.00001 : n + 0.00001);
            const catPoseData = [
                { address: "/tracking/trackers/1/position", value: [0, 0.1, 0].map(floatify) }, // Hip
                { address: "/tracking/trackers/1/rotation", value: [0, 0, 0].map(floatify) },
                { address: "/tracking/trackers/2/position", value: [0, 0.25, 0.2].map(floatify) }, // Chest
                { address: "/tracking/trackers/2/rotation", value: [340, 0, 0].map(floatify) }, // 340 instead of -20 for positive angles
                { address: "/tracking/trackers/head/position", value: [0, 0.4, 0.4].map(floatify) }, // Head
                { address: "/tracking/trackers/head/rotation", value: [10, 0, 15].map(floatify) },
                { address: "/tracking/trackers/3/position", value: [-0.2, 0.05, -0.3].map(floatify) }, // L Foot
                { address: "/tracking/trackers/3/rotation", value: [0, 0, 0].map(floatify) },
                { address: "/tracking/trackers/4/position", value: [0.2, 0.05, -0.3].map(floatify) }, // R Foot
                { address: "/tracking/trackers/4/rotation", value: [0, 0, 0].map(floatify) },
                { address: "/tracking/trackers/5/position", value: [-0.15, 0.08, -0.15].map(floatify) }, // L Knee
                { address: "/tracking/trackers/5/rotation", value: [0, 0, 0].map(floatify) },
                { address: "/tracking/trackers/6/position", value: [0.15, 0.08, -0.15].map(floatify) }, // R Knee
                { address: "/tracking/trackers/6/rotation", value: [0, 0, 0].map(floatify) },
                { address: "/tracking/trackers/7/position", value: [-0.2, 0.1, 0.3].map(floatify) }, // L Elbow
                { address: "/tracking/trackers/7/rotation", value: [0, 0, 0].map(floatify) },
                { address: "/tracking/trackers/8/position", value: [0.2, 0.1, 0.3].map(floatify) }, // R Elbow
                { address: "/tracking/trackers/8/rotation", value: [0, 0, 0].map(floatify) },
            ];

            this.catPoseTimer = setInterval(() => {
                catPoseData.forEach(item => {
                    osc.sendMessage(item.address, item.value);
                });
            }, 100); // 100ms interval to keep tracking alive
        } else {
            if (this.catPoseTimer) {
                clearInterval(this.catPoseTimer);
                this.catPoseTimer = null;
            }
            // VRChat will revert to standard tracking when OSC messages stop
        }
    };

    toggleBlink = () => {
        this.blinkActive = !this.blinkActive;
        if (this.blinkActive) {
            this.currentEyesClosed = 0.00001;

            // 持续下发 OSC 保证眼动追踪不进入休眠 (VRChat 10秒无数据会自动关闭眼追)
            // 同时发送眼球中央朝向 (CenterPitchYaw) 确保完整接管眼追系统
            this.blinkInternalTimer = setInterval(() => {
                osc.sendMessage("/tracking/eye/EyesClosedAmount", [this.currentEyesClosed]);
                osc.sendMessage("/tracking/eye/CenterPitchYaw", [0.00001, 0.00001]); // 维持直视前方
            }, 100);

            // 控制眨眼的周期逻辑
            this.blinkTimer = setInterval(() => {
                this.currentEyesClosed = 0.99999; // 快速闭眼
                setTimeout(() => {
                    this.currentEyesClosed = 0.00001; // 150ms后恢复睁开
                }, 150);
            }, 3000);
        } else {
            if (this.blinkTimer) clearInterval(this.blinkTimer);
            if (this.blinkInternalTimer) clearInterval(this.blinkInternalTimer);
            this.blinkTimer = null;
            this.blinkInternalTimer = null;

            // 停止时发送一次彻底睁眼
            osc.sendMessage("/tracking/eye/EyesClosedAmount", [0.00001]);
        }
    };

    setPortIn = (port: number) => {
        this.portIn = port;
        storage.set("portIn", port);
        if (this.oscListenerActive) {
            this.startOscListener();
        }
    };

    toggleOscListener = () => {
        this.oscListenerActive = !this.oscListenerActive;
        storage.set("oscListenerActive", this.oscListenerActive);
        if (this.oscListenerActive) {
            this.startOscListener();
        } else {
            this.stopOscListener();
        }
    };

    startOscListener = () => {
        try {
            console.log(`[JS RootStore] Starting OSC listener on port ${this.portIn}...`);
            osc.createServer("", this.portIn);
            if (!this.oscSubscription) {
                const VrcOscModule = TurboModuleRegistry.get("VrcOsc");
                if (VrcOscModule) {
                    console.log("[JS RootStore] Subscribing to Native GotMessage events");
                    const eventEmitter = new NativeEventEmitter(VrcOscModule as any);
                    this.oscSubscription = eventEmitter.addListener("GotMessage", (oscMessage: any) => {
                        this.handleIncomingOscMessage(oscMessage);
                    });
                } else {
                    console.warn("[JS RootStore] VrcOscModule not found in TurboModuleRegistry");
                }
            }
        } catch (error) {
            console.error("启动 OSC 监听失败:", error);
        }
    };

    stopOscListener = () => {
        try {
            console.log("[JS RootStore] Stopping OSC listener...");
            osc.createServer("", 0);
            if (this.oscSubscription) {
                this.oscSubscription.remove();
                this.oscSubscription = null;
                console.log("[JS RootStore] Unsubscribed from GotMessage events");
            }
        } catch (error) {
            console.error("停止 OSC 监听失败:", error);
        }
    };

    toggleAutoDrawGun = () => {
        this.autoDrawGunEnabled = !this.autoDrawGunEnabled;
        storage.set("autoDrawGunEnabled", this.autoDrawGunEnabled);
    };

    handleIncomingOscMessage = (message: any) => {
        // 注释掉高频打印，避免 Metro 控制台日志洪泛
        // console.log("ALL [JS RootSto /re] Received message event from native:", message);
        if (!message.address.includes("Ang")) {
            console.log("[JS RootSto /re] Received message event from native:", message);
        }
        if (!message) return;

        // 自动掏枪触发逻辑
        if (this.autoDrawGunEnabled && message.address === "/avatar/parameters/GestureRight") {
            const gestureValue = message.data?.[0];
            if (gestureValue === 6) {
                console.log("[JS RootStore] Detected GestureRight = 6, triggering openGun");
                osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_Weapon_off", [false]);
                osc.sendMessage("/avatar/parameters/Tri_PunisherZenith_grab_on", [true]);
            } else {
                console.log(typeof gestureValue);
            }
        }

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;
        const newMsg = {
            id: Math.random().toString(36).substring(7),
            address: message.address || "",
            data: message.data || [],
            time: timeStr,
        };
        this.lastOscMessages = [newMsg, ...this.lastOscMessages.slice(0, 19)];
    };
}

export default RootStore;
