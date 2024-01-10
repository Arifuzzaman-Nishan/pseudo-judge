import Settings from "@/components/Settings";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Settings | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default function SettingsPage() {
  return (
    <>
      <Settings />
    </>
  );
}
