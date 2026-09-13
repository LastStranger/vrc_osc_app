import { createContext, useContext } from "react";
import RootStore from "@/store/rootStore";

export const StoreContext = createContext<RootStore | null>(null);

export const useStore = (): RootStore => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreContext.Provider");
    }
    return context;
};
