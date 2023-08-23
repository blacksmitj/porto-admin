"use client";

import * as z from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { Role, Work } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface WorkFormProps {
  initialData: Work | null;
  roles: Role[];
  userId: string;
}

const formSchema = z.object({
  roleId: z.string().min(1),
  company: z.string().min(1),
  companyLink: z.string().min(1).nullable(),
  address: z.string().min(1).nullable(),
  fromDate: z.date(),
  toDate: z.date().nullable(),
  description: z.string().min(1),
});

type WorkFormValues = z.infer<typeof formSchema>;

export const WorkForm: React.FC<WorkFormProps> = ({
  initialData,
  roles,
  userId,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [present, setPresent] = useState(false);

  const title = initialData ? "Edit Work" : "Create Work";
  const description = initialData ? "Edit a Work" : "Add a new Work";
  const toastMessage = initialData ? "Work updated." : "Work created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<WorkFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      roleId: undefined,
      company: "",
      fromDate: undefined,
      toDate: null,
      description: "",
    },
  });

  const onSubmit = async (data: WorkFormValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(`/api/${userId}/works/${params.workId}`, data);
      } else {
        await axios.post(`/api/${userId}/works`, data);
      }
      router.refresh();
      router.push(`/works`);
      toast({
        title: toastMessage,
        description: "Change data " + toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Roles Error " + error.response.status,
        description: error.response.data.substring(0, 80),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${userId}/works/${params.roleId}`);
      router.refresh();
      router.push(`/works`);
      toast({
        title: toastMessage,
        description: "Change data with" + toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Works Error " + error.response.status,
        description: error.response.data,
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const onPresentClick = useCallback((value: any) => {
    if (value) {
      setPresent(value);
      form.setValue("toDate", null);
    } else {
      setPresent(false);
      form.setValue("toDate", new Date());
    }
  }, []);

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
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Name of company"
                      {...field}
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
                  <FormLabel>Company Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Address of Company"
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
              name="companyLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Link</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Link of company"
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
              name="fromDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join From</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value || undefined}
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
              name="toDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Until</FormLabel>
                  <FormControl>
                    <div className="flex w-full items-center space-x-4">
                      <DatePicker
                        value={
                          present || !field.value
                            ? undefined
                            : field.value || new Date()
                        }
                        onChange={field.onChange}
                        disable={isLoading || present || !field.value}
                      />
                      <div className="flex space-x-1 items-center">
                        <Checkbox
                          checked={!field.value}
                          onCheckedChange={(checked) => onPresentClick(checked)}
                          className="mr-1"
                        />
                        Present
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select Role"
                          defaultValue={field.value}
                        ></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />

                    <SelectContent>
                      {roles.length === 0 && (
                        <SelectItem disabled value="">
                          Fill role on Roles Page
                        </SelectItem>
                      )}
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
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
