import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { AttendanceEventType } from "@/types/attendance";

import { FingerprintIcon } from "./fingerprint-icon";
import { punchLabel } from "./punch-label";

type PunchFabProps = {
  nextPunch: AttendanceEventType | null;
  isPunching: boolean;
  onPunch: (type: AttendanceEventType) => void;
};

const CORE = 108;
const OUTER = CORE + 44;
const INNER = CORE + 22;

export const PunchFab = ({ nextPunch, isPunching, onPunch }: PunchFabProps) => {
  const pulse = useSharedValue(0);
  const press = useSharedValue(1);

  useEffect(() => {
    if (!nextPunch || isPunching) {
      pulse.value = withTiming(0, { duration: 240 });
      return;
    }

    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [isPunching, nextPunch, pulse]);

  const outerRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.08 }],
    opacity: 0.35 + pulse.value * 0.35,
  }));

  const innerRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.04 }],
    opacity: 0.55 + pulse.value * 0.25,
  }));

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const handlePressIn = () => {
    press.value = withTiming(0.94, { duration: 120 });
  };

  const handlePressOut = () => {
    press.value = withTiming(1, { duration: 160 });
  };

  if (!nextPunch) {
    return (
      <View style={styles.wrap} accessibilityRole="text">
        <View style={styles.doneRing}>
          <View style={styles.doneCore}>
            <Text style={styles.doneMark}>✓</Text>
            <Text style={styles.doneLabel}>Done</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.outerRing, outerRingStyle]} />
      <Animated.View style={[styles.innerRing, innerRingStyle]} />

      <Animated.View style={coreStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={punchLabel(nextPunch)}
          disabled={isPunching}
          onPress={() => onPunch(nextPunch)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.core, isPunching && styles.coreDisabled]}
        >
          {isPunching ? (
            <ActivityIndicator color={Brand.surface} />
          ) : (
            <View style={styles.content}>
              <FingerprintIcon size={30} color={Brand.surface} />
              <Text style={styles.label}>{punchLabel(nextPunch)}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
    width: OUTER,
    height: OUTER,
    alignSelf: "center",
  },
  outerRing: {
    position: "absolute",
    width: OUTER,
    height: OUTER,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: "rgba(60, 219, 157, 0.55)",
    backgroundColor: "rgba(60, 219, 157, 0.08)",
  },
  innerRing: {
    position: "absolute",
    width: INNER,
    height: INNER,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: "rgba(60, 219, 157, 0.75)",
    backgroundColor: "rgba(60, 219, 157, 0.12)",
  },
  core: {
    width: CORE,
    height: CORE,
    borderRadius: Radii.full,
    backgroundColor: Brand.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  coreDisabled: {
    opacity: 0.7,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: Spacing.two,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.surface,
    textAlign: "center",
  },
  doneRing: {
    width: INNER,
    height: INNER,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Brand.secondaryMuted,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(60, 219, 157, 0.08)",
  },
  doneCore: {
    width: CORE,
    height: CORE,
    borderRadius: Radii.full,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.secondaryMuted,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  doneMark: {
    fontSize: 22,
    fontWeight: "700",
    color: Brand.secondary,
  },
  doneLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.muted,
  },
});
