import { DataT } from "@/app/(tabs)/types";
import oscData from "@/app/(tabs)/data.json";
import { makeAutoObservable } from "mobx";

class HomeStore {
    actIndex?: number = undefined;
    oscArr: DataT[];

    constructor() {
        this.oscArr = oscData?.parameters as DataT[];
        makeAutoObservable(this);
    }

    changeStatus = (index: number) => {
        if (this.oscArr[index]?.input?.type === "Bool") {
            const status: boolean = this.oscArr[index]?.status ?? false;
            this.oscArr[index].status = !status;
        } else {
        }
    };

    deleteOscItem = (name: string) => {
        this.oscArr = this.oscArr.filter((item: DataT) => item.name !== name);
    };

    changeActIndex = (index?: number) => {
        // this.actIndex = index;
        // if(index !== undefined){
        //  this.oscArr[index].slideStatus = true;
        // }
        if (this.actIndex !== undefined) {
            this.oscArr[this.actIndex].slideStatus = false;
        }
    };

    changeItemSlideStatus = (index: number, status: boolean) => {
        console.log(":=s===status", status);
        if (status) {
            this.oscArr[index].slideStatus = true;
            this.actIndex = index;
        } else {
            this.oscArr[this.actIndex ?? 0].slideStatus = false;
        }
    };
}

export default HomeStore;
