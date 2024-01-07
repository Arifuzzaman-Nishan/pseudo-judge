import DialogComponent from "@/components/Shared/DialogComponent";
import { useState } from "react";
import EnrollForm from "./EnrollmentForm";
import { Button } from "@/components/ui/button";

const EnrollDialog = ({ groupId }: { groupId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DialogComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Enroll"
        description="Enroll this group by using enrollment key"
        content={<EnrollForm groupId={groupId} />}
        footer={
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Enroll</Button>
          </div>
        }
      />
      <Button onClick={() => setIsOpen(true)}>Enroll</Button>
    </>
  );
};

export default EnrollDialog;
