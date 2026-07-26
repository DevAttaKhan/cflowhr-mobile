import { Platform } from "react-native";
import { Stack } from "expo-router";

import { Brand } from "@/constants/theme";

const sheetOptions =
  Platform.OS === "ios"
    ? {
        presentation: "formSheet" as const,
        sheetGrabberVisible: true,
        sheetAllowedDetents: [0.85, 1] as number[],
      }
    : {
        presentation: "modal" as const,
      };

export default function LeaveStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Brand.canvas },
        headerTintColor: Brand.ink,
        contentStyle: { backgroundColor: Brand.canvas },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="request"
        options={{
          ...sheetOptions,
          title: "Request leave",
        }}
      />
    </Stack>
  );
}
