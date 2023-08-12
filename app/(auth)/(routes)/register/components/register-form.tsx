"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { Gamepad2 } from "lucide-react";

const formSchema = z
  .object({
    email: z.string().email().nonempty(),
    password: z.string().min(6).nonempty(),
    repassword: z.string().min(6).nonempty(),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Password not match",
    path: ["repassword"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      repassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    axios
      .post("/api/register", data)
      .then(() => {
        router.push("/login");
        toast({
          title: "Success Register",
          description: "Go login now!",
        });
      })
      .catch((error) => {
        console.log(error);

        toast({
          title: "Uh oh!",
          description: error.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Daftar pengaturan website ganteng!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Masukan email kamu"
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="***********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retype Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="***********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="w-full" type="submit">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs">
          Already register?{" "}
          <Link href={"/login"} className="underline hover:text-cyan-800">
            click here!
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
