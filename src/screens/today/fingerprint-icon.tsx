import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { Brand } from "@/constants/theme";

type FingerprintIconProps = {
  size?: number;
  color?: string;
};

export const FingerprintIcon = ({
  size = 28,
  color = Brand.surface,
}: FingerprintIconProps) => (
  <View style={styles.wrap} accessibilityElementsHidden>
    <SymbolView
      name={{
        ios: "touchid",
        android: "fingerprint",
        web: "fingerprint",
      }}
      size={size}
      tintColor={color}
      weight="medium"
      fallback={
        <View style={[styles.fallback, { width: size, height: size }]}>
          <View
            style={[
              styles.arc,
              {
                width: size * 0.72,
                height: size * 0.72,
                borderColor: color,
                borderRadius: size,
              },
            ]}
          />
          <View
            style={[
              styles.arc,
              {
                width: size * 0.48,
                height: size * 0.48,
                borderColor: color,
                borderRadius: size,
                opacity: 0.75,
              },
            ]}
          />
          <View
            style={[
              styles.core,
              {
                width: size * 0.14,
                height: size * 0.14,
                borderRadius: size,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      }
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  arc: {
    position: "absolute",
    borderWidth: 1.5,
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  core: {
    position: "absolute",
  },
});
