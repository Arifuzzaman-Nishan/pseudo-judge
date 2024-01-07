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
import { useSelector } from "@/lib/redux";
import { selectAuth } from "@/lib/redux/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import { enrollUserToGroupMutation } from "@/lib/tanstackQuery/api/groupsApi";
import { toast } from "sonner";
import { AxiosError } from "axios";
import errorFn from "@/components/Shared/Error";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

    toast.promise(mutation.mutateAsync(newData), {
      loading: "Enrolling...",
      success: "Enrolled successfully",
      error: (err: AxiosError) => {
        return errorFn(err);
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

export default EnrollForm;
