import HomeStore from "@/store/homeStore";

export type DataT = {
    name: string;
    input: {
        address: string;
        type: "Bool";
    };
    status?: boolean;
    slideStatus?: boolean;
}

export type HomeContextT ={
    store: HomeStore
}