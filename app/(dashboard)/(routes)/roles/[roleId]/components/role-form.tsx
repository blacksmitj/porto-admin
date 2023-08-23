"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Trash } from "lucide-react";
import { Role } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modal/alert-modal";
import { Checkbox } from "@/components/ui/checkbox";

interface RoleFormProps {
  initialData: Role | null;
  userId: string;
}

const formSchema = z.object({
  label: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
});

type RoleFormValues = z.infer<typeof formSchema>;

export const RoleForm: React.FC<RoleFormProps> = ({ initialData, userId }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit Role" : "Create Role";
  const description = initialData ? "Edit a Role" : "Add a new Role";
  const toastMessage = initialData ? "Role updated." : "Role created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      isFeatured: false,
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(`/api/${userId}/roles/${params.roleId}`, data);
      } else {
        await axios.post(`/api/${userId}/roles/`, data);
      }
      router.refresh();
      router.push(`/roles`);
      toast({
        title: toastMessage,
        description: "Change data with " + toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Roles Error " + error.response.status,
        description: error.response.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${userId}/roles/${params.roleId}`);
      router.refresh();
      router.push(`/roles`);
      toast({
        title: toastMessage,
        description: "Change data with" + toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Roles Error " + error.response.status,
        description:
          "This roles already used by another work/project " +
          error.response.data.substring(0, 80),
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Label of your Role"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This role will apear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
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
    </>
  );
};
