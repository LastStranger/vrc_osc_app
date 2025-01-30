import { DataT } from "@/app/(tabs)/types";
import oscData from "@/app/(tabs)/data.json";
import { makeAutoObservable } from "mobx";

class HomeStore {
    actIndex?: number = undefined; // 当前激活的index
    oscArr: DataT[] = oscData?.parameters as DataT[]; // osc数组

    constructor() {
        makeAutoObservable(this);
    }

    // 切换状态
    changeStatus = (index: number) => {
        if (this.oscArr[index]?.input?.type === "Bool") {
            const status: boolean = this.oscArr[index]?.status ?? false;
            this.oscArr[index].status = !status;
        } else {
        }
    };

    // 删除item
    deleteOscItem = (name: string) => {
        this.oscArr = this.oscArr.filter((item: DataT) => item.name !== name);
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
}

export default HomeStore;
