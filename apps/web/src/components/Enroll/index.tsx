"use client";

import React from "react";
import Container from "../Shared/Container";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  enrollmentKey: z.string(),
});

const EnrollForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enrollmentKey: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {}

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

const EnrollCard = () => {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Enroll blue-5 group</CardTitle>
        <CardDescription>
          Enroll this group by using enrollment key
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EnrollForm />
        {/* <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input id="name" placeholder="Name of your project" />
            </div>
          </div>
        </form> */}
      </CardContent>
    </Card>
  );
};

const Enroll = () => {
  return (
    <Container>
      <div className="flex justify-center">
        <EnrollCard />
      </div>
    </Container>
  );
};

export default Enroll;
