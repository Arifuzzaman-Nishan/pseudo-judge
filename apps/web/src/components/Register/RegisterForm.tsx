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
import { useMutation } from "@tanstack/react-query";
import { registerMuation } from "@/lib/tanstackQuery/api/authApi";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next-nprogress-bar";
import errorFn from "../Shared/Error";

type FormFieldType =
  | "password"
  | "confirmPassword"
  | "username"
  | "email"
  | "fullName";

const formSchema = z
  .object({
    fullName: z.string().min(5, {
      message: "Full name must be at least 5 characters long",
    }),
    username: z.string().min(4, {
      message: "Username must be at least 4 characters long",
    }),
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
    label: "Full Name",
    name: "fullName",
    placeholder: "boss psuedojudge",
    type: "text",
  },
  {
    key: 2,
    label: "Username",
    name: "username",
    placeholder: "psuedojudge",
    type: "text",
  },
  {
    key: 3,
    label: "Email",
    name: "email",
    placeholder: "boss@gmail.com",
    type: "email",
  },
  {
    key: 4,
    label: "Password",
    name: "password",
    placeholder: "********",
    type: "password",
  },
  {
    key: 5,
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
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerMuation,
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(mutation.mutateAsync(values), {
      loading: "Registering...",
      success: () => {
        router.push("/problems");
        return "Registered successfully";
      },
      error: (err: AxiosError) => {
        return errorFn(err);
      },
    });

    form.reset();
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
          <Button disabled={mutation.isPending} type="submit">
            Register
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
