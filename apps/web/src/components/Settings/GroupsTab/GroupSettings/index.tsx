import Container from "@/components/Shared/Container";
import React, { FC } from "react";
import ProblemTable from "./ProblemTable";

type Props = {
  groupId: string;
};

const GroupSettings: FC<Props> = ({ groupId }) => {
  return (
    <Container>
      <ProblemTable groupId={groupId} />
    </Container>
  );
};

export default GroupSettings;
