import { makeAutoObservable } from 'mobx';

export class RootStore {
    address?: string = "192.168.0.1"; // vrc的IP地址
    portOut?: string = "9000"; // vrc的端口号
    constructor() {
        makeAutoObservable(this);
    }


    // 设置地址和端口的方法
    setAddress = (address: string) => {
        this.address = address;
    }

    setPortOut = (portOut: string) => {
        this.portOut = portOut;
    }

}

export default RootStore;