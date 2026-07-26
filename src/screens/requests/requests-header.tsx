import { StyleSheet, Text, View } from "react-native";

import { HeaderActionButton } from "@/components/ui/header-action-button";
import { Brand, Spacing } from "@/constants/theme";

type RequestsHeaderProps = {
  onCreate: () => void;
};

export const RequestsHeader = ({ onCreate }: RequestsHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.copy}>
      <Text style={styles.title}>Requests</Text>
      <Text style={styles.sub}>Attendance corrections</Text>
    </View>
    <HeaderActionButton
      label="New"
      accessibilityLabel="New attendance request"
      onPress={onCreate}
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 13,
    color: Brand.muted,
    fontWeight: "500",
  },
});
