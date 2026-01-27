import { DataT } from "@/store/types";

export type Props = {
    item: DataT;
    index: number;
    status?: boolean;
    // onOperate: (item: DataT) => void;
    // onDelete: (item: DataT) => void;
}