import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GroupsTabForm from "./GroupsTabForm";
import GroupsTabTable from "./GroupsTabTable";
import { ReactNode, useState } from "react";
import DialogComponent from "@/components/Shared/DialogComponent";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <section>
      <DialogComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Group"
        description="Enter the group name. Click save when you're done."
        content={<GroupsTabForm />}
      />

      <GroupsTabTable setIsOpen={setIsOpen} />
    </section>
  );
};

export default GroupsTab;
