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

const GroupsTabForm = () => {
  const form = useForm<z.infer<typeof GroupFormSchema>>({
    resolver: zodResolver(GroupFormSchema),
    defaultValues: {
      groupName: "",
      enrollmentKeyExpiration: "",
    },
  });

  function onSubmit(data: z.infer<typeof GroupFormSchema>) {
    console.log("group data is ", data);
  }

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
