import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GroupsTabForm from "./GroupsTabForm";
import GroupsTabTable from "./GroupsTabTable";
import { ReactNode } from "react";

const GroupsFromCard = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader>
        <CardTitle>Add Group</CardTitle>
        <CardDescription>
          Enter the group name. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
};

const GroupsTab = () => {
  return (
    <section>
      <div>
        <GroupsFromCard>
          <GroupsTabForm />
        </GroupsFromCard>
      </div>
      <div>
        <GroupsTabTable />
      </div>
    </section>
  );
};

export default GroupsTab;
