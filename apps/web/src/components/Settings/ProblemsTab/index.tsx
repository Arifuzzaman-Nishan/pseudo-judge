import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProblemsTabForm from "./ProblemsTabForm";

const ProblemsTab = () => {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Add Problem</CardTitle>
          <CardDescription>
            Enter the problem url. Click save when you&apos;re done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ProblemsTabForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default ProblemsTab;
