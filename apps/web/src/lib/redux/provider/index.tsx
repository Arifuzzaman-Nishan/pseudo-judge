"use client";

import { Provider } from "react-redux";
import { reduxStore } from "@/lib/redux";

const ReduxProvider = (props: React.PropsWithChildren) => {
  return <Provider store={reduxStore}>{props.children}</Provider>;
};

export default ReduxProvider;
