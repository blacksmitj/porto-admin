"use client";

import * as z from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
});

type LoginFormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (isLoading) return null;
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    })
      .then((callback) => {
        setIsLoading(false);
        if (callback?.ok) {
          toast({
            title: "Success Login",
            description: "Go make magic now!",
          });
          router.push("/");
        }
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
        <CardTitle>Login</CardTitle>
        <CardDescription>Masuk pengaturan website ganteng!</CardDescription>
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
            <Button disabled={isLoading} className="w-full" type="submit">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 my-2">
        <Button
          variant={"outline"}
          className="w-full"
          onClick={() => signIn("google")}
        >
          <Gamepad2 className="h-4 w-4 mr-2" />
          Login with Google!
        </Button>
        <p className="text-xs">
          Do not have account?{" "}
          <Link href={"/register"} className="underline hover:text-cyan-800">
            click here!
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
