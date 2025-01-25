import { DataT } from "@/app/(tabs)/types";

export type Props = {
    item: DataT;
    index: number;
    onOperate: (item: DataT, index: number) => void;
    onDelete: (index: number) => void;
}