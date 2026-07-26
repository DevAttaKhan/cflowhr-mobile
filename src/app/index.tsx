import { Redirect } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { useAppSelector } from "@/store/store";

export default function Index() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  if (isLoggedIn) {
    return <Redirect href="/(employee)/today" />;
  }
  return <Redirect href="/(auth)/login" />;
}
