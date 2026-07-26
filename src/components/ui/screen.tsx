import type { PropsWithChildren } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brand, Spacing } from "@/constants/theme";

type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  edges?: ("top" | "right" | "bottom" | "left")[];
}>;

export const Screen = ({
  children,
  style,
  edges = ["top", "left", "right"],
}: ScreenProps) => (
  <SafeAreaView edges={edges} style={styles.safe}>
    <View style={[styles.inner, style]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Brand.canvas,
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },
});
