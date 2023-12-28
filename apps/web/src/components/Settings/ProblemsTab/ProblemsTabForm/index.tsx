import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DifficultyRating, OJName } from "@/types";
import * as z from "zod";
import { FormFieldType, ProblemFormSchema } from "./schema";
import { formFields } from "./data";

const ProblemsTabForm = () => {
  const form = useForm<z.infer<typeof ProblemFormSchema>>({
    resolver: zodResolver(ProblemFormSchema),
    defaultValues: {
      url: "",
      ojName: OJName.LOJ,
      difficultyRating: DifficultyRating.EASY,
    },
  });

  function onSubmit(data: z.infer<typeof ProblemFormSchema>) {
    console.log("problem form data", data);
  }

  const handleChange = () => {
    console.log("changed");
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-3 grid w-full items-center gap-4"
        >
          {formFields.map((formField) => (
            <FormField
              key={formField.key}
              control={form.control}
              name={formField.name as FormFieldType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{formField.label}</FormLabel>
                  {formField.type === "select" ? (
                    <Select required onValueChange={field.onChange}>
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
                        {...field}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default ProblemsTabForm;
