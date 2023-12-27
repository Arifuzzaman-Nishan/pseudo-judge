import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormFieldType = "password" | "confirmPassword" | "username" | "email";

const formSchema = z
  .object({
    username: z.string(),
    email: z.string().email({
      message: "Please enter a valid email",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const formFields = [
  {
    key: 1,
    label: "Username",
    name: "username",
    placeholder: "psuedojudge",
    type: "text",
  },
  {
    key: 2,
    label: "Email",
    name: "email",
    placeholder: "boss@gmail.com",
    type: "email",
  },
  {
    key: 3,
    label: "Password",
    name: "password",
    placeholder: "********",
    type: "password",
  },
  {
    key: 4,
    label: "Confirm Password",
    name: "confirmPassword",
    placeholder: "********",
    type: "password",
  },
];

const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {formFields.map((formField) => (
            <FormField
              key={formField.key}
              control={form.control}
              name={formField.name as FormFieldType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{formField.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={formField.type}
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
          <Button type="submit">Register</Button>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
