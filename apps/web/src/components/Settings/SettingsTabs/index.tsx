import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupsTab from "../GroupsTab";
import ProblemsTab from "../ProblemsTab";

const SettingsTabs = () => {
  return (
    <Tabs defaultValue="groups" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
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
