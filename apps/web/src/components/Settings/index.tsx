"use client";

import React from "react";
import Container from "../Shared/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupsTab from "./GroupsTab";
import ProblemsTab from "./ProblemsTab";

const Settings = () => {
  return (
    <Container>
      <div className="">
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
      </div>
    </Container>
  );
};

export default Settings;
