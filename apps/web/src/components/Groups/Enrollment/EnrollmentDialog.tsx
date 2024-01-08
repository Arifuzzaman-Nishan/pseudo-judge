import DialogComponent from "@/components/Shared/DialogComponent";
import { useState } from "react";
import EnrollForm from "./EnrollmentForm";
import { Button } from "@/components/ui/button";
import { useSelector } from "@/lib/redux";
import { selectAuth } from "@/lib/redux/slices/authSlice";
import AlertDialogComponent from "@/components/Shared/AlertDialogComponent";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next-nprogress-bar";

const EnrollDialog = ({ groupId }: { groupId: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useSelector(selectAuth);
  const router = useRouter();

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleEnroll = () => {
    if (auth.isLogin) {
      setIsOpen(true);
    } else {
      setIsAlertOpen(true);
    }
  };

  return (
    <>
      <AlertDialogComponent
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        title="Login Required!"
        description="You cannot do enroll. please login first"
        footerJSX={
          <AlertDialogAction onClick={() => router.push("/login")}>
            Login
          </AlertDialogAction>
        }
      />
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
      <Button onClick={handleEnroll}>Enroll</Button>
    </>
  );
};

export default EnrollDialog;
