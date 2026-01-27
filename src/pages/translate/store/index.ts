import { makeAutoObservable } from "mobx";

class Store {
    sourceLang: string = "zh";
    targetLang: string = "en";

    constructor() {
        makeAutoObservable(
            this,
            {},
            {
                autoBind: true, // 自动绑定方法
            },
        );
    }

    changeSourceLang = (sourceLang: string) => {
        this.sourceLang = sourceLang;
    };

    changeTargetLang = (targetLang: string) => {
        this.targetLang = targetLang;
    };
}
export default Store;
