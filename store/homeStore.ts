import { DataT } from "@/store/types";
import { autorun, IReactionDisposer, makeAutoObservable, runInAction } from "mobx";
import osc from "react-native-vrc-osc";
import RootStore from "@/store/rootStore";
import { Alert } from "react-native";
import { storage } from "@/store/mmkv";

class HomeStore {
    actIndex?: number = undefined; // 当前激活的index
    // oscArr: DataT[] = oscData?.parameters as DataT[]; // osc数组
    oscArr: DataT[] = []; // osc数组
    rootStore: RootStore;
    private disposers: IReactionDisposer[] = [];
    // address?: string = undefined; // vrc的IP地址
    // portOut?: string = undefined; // vrc的端口号

    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {}, {
            autoBind: true // 自动绑定方法
        });
        this.rootStore = rootStore;
        // const portOut = 9000;
        // const address = "192.168.31.180";
        // osc.createClient(this.address, this.portOut);
        // 存储 disposer 函数以便后续清理
        this.disposers.push(
            autorun(() => {
                // 重新设置客osc的IP地址和端口号
                this.resetOscArr(this.rootStore.avatarInfo);
            }),
            autorun(() => {
                // 重新设置avatar数据
                this.resetOscClient(this.rootStore.address, this.rootStore.portOut);
            })
        );
    }

    // 重新设置客osc的IP地址和端口号
    resetOscClient = (address: string, portOut: number) => {
        osc.createClient(address, portOut);
    }

    // 重新设置avatar数据
    resetOscArr = (avatarInfoArr?: DataT[]): void => {
        // todo 为什么这里要包裹一层runInAction
        runInAction(() => {
            this.oscArr = avatarInfoArr ?? [];
            this.actIndex = undefined;
        });
    }


    // 切换状态
    changeStatus = (index: number) => {
        if (this.oscArr[index]?.input?.type === "Bool") {
            const status: boolean = this.oscArr[index]?.status ?? false;
            this.oscArr[index].status = !status;
            const params = this.oscArr[index]?.input?.address;
            osc.sendMessage(params, [status]);
            // osc.sendMessage("/chatbox/input", ["hello world"]);
            // osc.sendMessage('/chatbox/input', ["hello world", true, true]);
        } else {
            //提示无法切换
            // 使用Alert显示提示
            Alert.alert(
                "提示",
                "当前类型无法切换状态",
                [
                    { text: "确定", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
    };

    // 删除item
    deleteOscItem = (name: string) => {
        this.oscArr = this.oscArr.filter((item: DataT) => item.name !== name);
        storage.set("avatarInfo", JSON.stringify(this.oscArr));
    };

    changeActIndex = (index?: number) => {
        //上下滑动的时候,关闭激活中的Item
        if (this.actIndex !== undefined && this.oscArr[this.actIndex]) {
            this.oscArr[this.actIndex].slideStatus = false;
        }
    };

    // 改变item的滑动状态
    changeItemSlideStatus = (index: number, status: boolean) => {
        if (!this.oscArr[this.actIndex ?? 0] || !this.oscArr[index]) {
            return;
        }
        // 如果是滑动打开状态,则将状态设为true,同时设置锚点为激活的index
        if (status) {
            this.oscArr[index].slideStatus = true;
            this.actIndex = index;
        } else {
            // 如果是滑动关闭状态,则将锚点激活的index的那个item状态设为false(用在当下一个item左右滑动开始的时候,关闭激活中的Item的滑动状态)
            this.oscArr[this.actIndex ?? 0].slideStatus = false;
        }
    };

    handleTrigger = (index: number) => {
        // if (this.oscArr[index]?.input?.type === "Bool") {
        //     const params = this.oscArr[index]?.input?.address;
        //     osc.sendMessage(params, [true]);
        // }
    }

    // 清理方法
    dispose = () => {
        this.disposers.forEach(dispose => dispose());
        this.disposers = [];
    }

}

export default HomeStore;
