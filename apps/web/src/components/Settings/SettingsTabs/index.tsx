import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupsTab from "../GroupsTab";
import ProblemsTab from "../ProblemsTab";

const SettingsTabs = () => {
  return (
    <Tabs defaultValue="groups">
      <TabsList className="grid grid-cols-2 w-[400px] mx-auto">
        <TabsTrigger value="groups">Groups</TabsTrigger>
        <TabsTrigger value="problems">Problems</TabsTrigger>
      </TabsList>
      <TabsContent value="groups">
        <GroupsTab />
      </TabsContent>
      <TabsContent value="problems">
        <ProblemsTab />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
