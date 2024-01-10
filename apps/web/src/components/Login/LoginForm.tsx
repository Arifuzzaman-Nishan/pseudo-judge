"use client";
import React, { useState } from "react";
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
import { loginMutation } from "@/lib/tanstackQuery/api/authApi";
import { toast } from "sonner";
import { AxiosError } from "axios";
import errorFn from "../Shared/Error";
import { useRouter } from "next-nprogress-bar";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

const LoginForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginMutation,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(mutation.mutateAsync(values), {
      loading: "Logging in...",
      success: () => {
        router.push("/problems");
        return "Logged in successfully";
      },
      error: (err: AxiosError) => {
        return errorFn(err);
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    required
                    placeholder="boss@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                {showPassword ? (
                  <EyeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[2.2rem] h-5 w-5 cursor-pointer"
                  />
                ) : (
                  <EyeSlashIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[2.2rem] h-5 w-5 cursor-pointer"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={mutation.isPending} type="submit">
            Login
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
