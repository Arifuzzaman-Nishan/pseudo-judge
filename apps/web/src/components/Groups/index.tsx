"use client";

import React from "react";
import Container from "../Shared/Container";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  GetGroupsType,
  enrollUserToGroupMutation,
  getGroupsQuery,
} from "@/lib/tanstackQuery/api/groupsApi";
import { ColumnDef } from "@tanstack/react-table";
import { DateTime } from "luxon";
import TableComponent from "../Shared/TableComponent";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DialogComponent from "../Shared/DialogComponent";
import { useSelector } from "@/lib/redux";
import { selectAuth } from "@/lib/redux/slices/authSlice";
import { toast } from "sonner";
import { AxiosError } from "axios";

const timeStampsToDateTime = (timeStamp: string) => {
  const dateTime = DateTime.fromISO(timeStamp);
  return dateTime.toFormat("dd/MM/yyyy");
};

const FormSchema = z.object({
  enrollmentKey: z.string(),
});

const EnrollForm = ({ groupId }: { groupId: string }) => {
  const currentUser = useSelector(selectAuth);

  const mutation = useMutation({
    mutationFn: enrollUserToGroupMutation,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enrollmentKey: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData = {
      ...data,
      groupId: groupId,
      userId: currentUser.userId,
    };
    console.log("new data is ", newData);
    toast.promise(mutation.mutateAsync(newData), {
      loading: "Enrolling...",
      success: "Enrolled successfully",
      error: (err: AxiosError) => {
        return (err.response?.data as any)?.error;
      },
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-6 grid w-full items-center gap-4"
      >
        <FormField
          control={form.control}
          name="enrollmentKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enrollmentkey</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="enter your enrollment key"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

const EnrollDialog = ({ groupId }: { groupId: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

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

export const columns: ColumnDef<GetGroupsType>[] = [
  {
    accessorKey: "index",
    header: "SI No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "groupName",
    header: "Group Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("groupName")}</div>
    ),
  },
  {
    accessorKey: "totalMembers",
    header: "Total Members",
    cell: ({ row }) => <div>{row.getValue("totalMembers")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <div>{timeStampsToDateTime(row.getValue("createdAt"))}</div>
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => <EnrollDialog groupId={row.original._id} />,
  },
];

const Groups = () => {
  const { data } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroupsQuery(false),
  });

  console.log("groups datq is ", data);

  return (
    <Container>
      <h3>Groups</h3>
      <TableComponent columns={columns} data={data || []} />
    </Container>
  );
};

export default Groups;
