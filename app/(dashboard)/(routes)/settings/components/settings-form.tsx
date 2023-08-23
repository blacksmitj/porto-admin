"use client";

import * as z from "zod";
import axios from "axios";

import { useState } from "react";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Heading } from "@/components/ui/heading";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ApiAlert } from "@/components/ui/api-alert";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { ImageUpload } from "@/components/ui/image-upload";

interface SettingsFormProps {
  initialData: User;
}

const formSchema = z.object({
  name: z.string().min(3).nullable(),
  dob: z.date().nullable(),
  address: z.string().min(3).nullable(),
  whatsapp: z.string().min(3).nullable(),
  linkedin: z.string().min(3).nullable(),
  biodata: z.string().min(10).nullable(),
  description: z.string().min(10).nullable(),
  image: z.string().nullable(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const origin = useOrigin();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/user/${initialData.id}/`, data);
      router.refresh();
      toast({
        title: "Settings Changed",
        description: "Setting has been changed",
      });
    } catch (error: any) {
      console.log(error);

      toast({
        variant: "destructive",
        title: "Save Error " + error.response.status,
        description: error.response.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage your website" />
        <Button disabled={isLoading}>x</Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || ""}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="What's your name?"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value || new Date()}
                      onChange={field.onChange}
                      disable={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Where you live?"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whatsapp</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your whatsapp number?"
                      {...field}
                      value={field.value || ""}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your linkedin url?"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="biodata"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Biodata</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder="Shoutout about your self!"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder="Description about your self!"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="ml-auto" type="submit">
            Save Changes
          </Button>
          <Button
            disabled={isLoading}
            className="ml-6"
            type="button"
            variant={"link"}
            onClick={router.back}
          >
            Back
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/user/${initialData.id}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
