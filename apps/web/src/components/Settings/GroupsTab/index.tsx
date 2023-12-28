import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GroupsTabForm from "./GroupsTabForm";

const GroupsTab = () => {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Add Group</CardTitle>
          <CardDescription>
            Enter the group name. Click save when you&apos;re done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <GroupsTabForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default GroupsTab;
