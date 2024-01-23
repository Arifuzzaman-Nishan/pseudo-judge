import GroupsTabForm from "./GroupsTabForm";
import GroupsTabTable from "./GroupsTabTable";
import { useState } from "react";
import DialogComponent from "@/components/Shared/DialogComponent";

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
