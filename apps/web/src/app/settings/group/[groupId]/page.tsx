import GroupSettings from "@/components/Settings/GroupsTab/GroupSettings";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Settings-Groups | PseudoJudge",
  description:
    "PseudoJudge is a platform for competitive programming enthusiasts to practice and compete with others.",
};

export default function SettingsGroupPage({
  params,
}: {
  params: {
    groupId: string;
  };
}) {
  return (
    <>
      <GroupSettings groupId={params.groupId} />
    </>
  );
}
