import { createContext } from "react";
import { TranslateContextT } from "./store/types";

export const TranslateContext = createContext<TranslateContextT>({} as TranslateContextT);
