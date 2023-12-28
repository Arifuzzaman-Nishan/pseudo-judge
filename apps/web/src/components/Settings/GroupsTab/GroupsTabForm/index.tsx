"use client";

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
import { Button } from "@/components/ui/button";
import { GroupFormFieldTypes, GroupFormSchema } from "./schema";
import { groupFromField } from "./data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupMutation } from "@/lib/tanstackQuery/api/groupsApi";
import { useToast } from "@/components/ui/use-toast";

const GroupsTabForm = () => {
  const { toast } = useToast();

  // const queryClient = getQueryClient();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createGroupMutation,
    onSuccess: (data) => {
      console.log("group created successfully", data);
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });

  const form = useForm<z.infer<typeof GroupFormSchema>>({
    resolver: zodResolver(GroupFormSchema),
    defaultValues: {
      groupName: "",
      // enrollmentKeyExpiration: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof GroupFormSchema>) => {
    console.log("group data is ", data);
    try {
      await mutation.mutateAsync(data);
      console.log("group created successfully");
      toast({
        title: "Group Created",
        description: "Group has been created successfully",
      });
    } catch (err: any) {
      // console.log("error is ", mutation.error);
      toast({
        title: "Group Creation Failed",
        description: "Group creation failed, please try again",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-6 grid w-full items-center gap-4"
      >
        {groupFromField.map((formField) => (
          <FormField
            key={formField.key}
            control={form.control}
            name={formField.name as GroupFormFieldTypes}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formField.name}</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder={formField.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default GroupsTabForm;
