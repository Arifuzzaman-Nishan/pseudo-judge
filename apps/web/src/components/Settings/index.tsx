"use client";

import React from "react";
import Container from "../Shared/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupsTab from "./GroupsTab";
import ProblemsTab from "./ProblemsTab";
import Link from "next/link";

const Settings = () => {
  return (
    <Container>
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Hello Admin
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mb-6">
          This is the admin panel. You can manage your groups and problems from
          here. You can add and remove users and problems from groups.
        </p>
      </div>

      <div className="mt-12">
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
