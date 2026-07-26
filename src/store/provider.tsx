import { Provider } from "react-redux";
import type { PropsWithChildren } from "react";

import { store } from "./store";

export const StoreProvider = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
);
