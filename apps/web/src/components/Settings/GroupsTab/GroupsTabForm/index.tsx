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
import { toast } from "sonner";
import { AxiosError } from "axios";
import errorFn from "@/components/Shared/Error";

const GroupsTabForm = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createGroupMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });

  const form = useForm<z.infer<typeof GroupFormSchema>>({
    resolver: zodResolver(GroupFormSchema),
    defaultValues: {
      groupName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof GroupFormSchema>) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating Group...",
      success: "Successfully Created Group",
      error: (err: AxiosError) => {
        return errorFn(err);
      },
    });
    form.reset();
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
                <FormLabel>{formField.label}</FormLabel>
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
        <Button disabled={mutation.isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default GroupsTabForm;
