import { makeAutoObservable } from 'mobx';
import { storage } from "@/store/mmkv";

export class RootStore {
    address?: string = storage.getString("address") ?? "192.168.0.1"; // vrc的IP地址
    portOut?: string = storage.getString("portOut") ?? "9000"; // vrc的端口号
    constructor() {
        makeAutoObservable(this);
    }


    // 设置地址和端口的方法
    setAddress = (address: string) => {
        this.address = address;
        storage.set("address", address);
    }

    setPortOut = (portOut: string) => {
        this.portOut = portOut;
        storage.set("portOut", portOut);
    }

}

export default RootStore;