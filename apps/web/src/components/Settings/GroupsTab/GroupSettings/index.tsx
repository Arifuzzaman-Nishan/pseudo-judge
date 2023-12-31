import Container from "@/components/Shared/Container";
import React, { FC } from "react";
import ProblemTable from "./ProblemTable";
import UsersTable from "./UsersTable";

type Props = {
  groupId: string;
};

const GroupSettings: FC<Props> = ({ groupId }) => {
  return (
    <Container>
      <ProblemTable groupId={groupId} />
      <UsersTable groupId={groupId} />
    </Container>
  );
};

export default GroupSettings;
