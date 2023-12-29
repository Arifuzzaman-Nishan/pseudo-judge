import ProblemsTabForm from "./ProblemsTabForm";
import ProblemsTable from "./ProblemsTable";
import DialogComponent from "@/components/Shared/DialogComponent";
import { useState } from "react";

const ProblemsTab = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <section>
      <DialogComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Problem"
        description="Enter the problem url. Click save when you're done."
        content={<ProblemsTabForm />}
      />
      <ProblemsTable setIsOpen={setIsOpen} />
    </section>
  );
};

export default ProblemsTab;
