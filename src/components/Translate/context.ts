import { createContext } from "react";
import { TranslateContextT } from "@/components/Translate/types";

export const TranslateContext = createContext<TranslateContextT>({} as TranslateContextT);