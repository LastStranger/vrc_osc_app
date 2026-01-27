import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ref, ...otherProps }: any) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

    return <View ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />;
}

const Dd = ({ ref }: ViewProps) => {
    return <View ref={ref} />;
};
