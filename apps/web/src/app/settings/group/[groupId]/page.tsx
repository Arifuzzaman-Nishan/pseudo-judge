import GroupSettings from "@/components/Settings/GroupsTab/GroupSettings";
import React from "react";

function SettingsGroupPage({
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

export default SettingsGroupPage;
