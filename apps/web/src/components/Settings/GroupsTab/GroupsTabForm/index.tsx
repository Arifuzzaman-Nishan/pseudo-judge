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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      cutoffNumber: 0,
      cutoffInterval: "weekly",
    },
  });

  const onSubmit = async (data: z.infer<typeof GroupFormSchema>) => {
    console.log("form data is ", data);

    toast.promise(mutation.mutateAsync(data), {
      loading: "Creating Group...",
      success: "Successfully Created Group",
      error: (err: AxiosError) => {
        return errorFn(err);
      },
    });
    // form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 grid w-full items-center gap-4"
      >
        {groupFromField.map((formField) => (
          <FormField
            key={formField.key}
            control={form.control}
            name={formField.name as GroupFormFieldTypes}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{formField.label}</FormLabel>
                {formField.type === "select" ? (
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={formField.defaultValue}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={formField.placeholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formField.options?.map((option) => (
                        <SelectItem key={option.key} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <FormControl>
                    <Input
                      required
                      type={formField.type}
                      placeholder={formField.placeholder}
                      {...(field as any)}
                    />
                  </FormControl>
                )}
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
