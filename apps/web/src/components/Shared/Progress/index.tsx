"use client";

import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Progress = () => {
  return (
    <ProgressBar
      height="4px"
      color="#1d4ed8"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

export default Progress;
