import { makeAutoObservable } from 'mobx';
import { storage } from "@/store/mmkv";
import oscDataDemo1 from "@/app/(tabs)/data.json";
import oscDataDemo2 from "@/app/(tabs)/dataBlue.json";
import { DataT } from "@/store/types";

export class RootStore {
    address?: string = storage.getString("address") ?? "192.168.0.1"; // vrc的IP地址
    portOut?: number = storage.getNumber("portOut") ?? 9000; // vrc的端口号
    avatarInfo?: DataT[] = [];
    avatarInputString?: string = undefined;
    constructor() {
        makeAutoObservable(this, {}, {
            autoBind: true // 自动绑定方法
        });
        this.initAvatarInfo();
    }

    initAvatarInfo = () => {
        const avatarInfo = storage.getString("avatarInfo");
        if (avatarInfo) {
            this.avatarInfo = JSON.parse(avatarInfo);
        }
    }


    // 设置地址和端口的方法
    setAddress = (address: string) => {
        this.address = address;
        storage.set("address", address);
    }

    setPortOut = (portOut: number) => {
        this.portOut = portOut;
        storage.set("portOut", portOut);
    }

    setAvatarJson = (avatarJson?: unknown) => {
        try {
            this.avatarInputString = avatarJson as string;
            // 类型守卫
            if (!avatarJson || typeof avatarJson !== "string") {
                console.warn('无效的 avatarJson 输入');
                return;
            }

            // 解析 JSON 并进行类型验证
            const parsed = JSON.parse(avatarJson);

            if (!parsed || !Array.isArray(parsed.parameters)) {
                console.warn('JSON 格式不正确或缺少 parameters 数组');
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
            console.error('解析 avatarJson 时出错:', error);
            this.avatarInfo = [];
        }
    }

    setDemo1Avatar = () => {
        this.avatarInfo = oscDataDemo1?.parameters as DataT[];
        this.avatarInputString = JSON.stringify(oscDataDemo1);
    }

    setDemo2Avatar = () => {
        this.avatarInfo = oscDataDemo2.parameters as DataT[];
        this.avatarInputString = JSON.stringify(oscDataDemo2);
    }

}

export default RootStore;