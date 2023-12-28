"use client";

import React from "react";
import Container from "../Shared/Container";
import SettingsTabs from "./SettingsTabs";

const Settings = () => {
  return (
    <Container>
      <div className="flex justify-center items-center">
        <SettingsTabs />
      </div>
    </Container>
  );
};

export default Settings;
