"use client";

import * as z from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { Education } from "@prisma/client";
import { useCallback, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface EducationFormProps {
  initialData: Education | null;
  userId: string;
}

const formSchema = z.object({
  label: z.string().min(1),
  study: z.string().min(1),
  fromDate: z.date(),
  toDate: z.date().nullable(),
});

type EducationFormValues = z.infer<typeof formSchema>;

export const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  userId,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [present, setPresent] = useState(false);

  const title = initialData ? "Edit Education" : "Create Education";
  const description = initialData ? "Edit a Education" : "Add a new Education";
  const toastMessage = initialData
    ? "Education updated."
    : "Education created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      study: "",
      fromDate: undefined,
      toDate: null,
    },
  });

  const onSubmit = async (data: EducationFormValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${userId}/educations/${params.educationId}`,
          data
        );
      } else {
        await axios.post(`/api/${userId}/educations`, data);
      }
      router.refresh();
      router.push(`/educations`);
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
      await axios.delete(`/api/${userId}/educations/${params.roleId}`);
      router.refresh();
      router.push(`/educations`);
      toast({
        title: toastMessage,
        description: "Change data with" + toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Educations Error " + error.response.status,
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
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Name of label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="study"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Concentrate</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Name of study"
                      {...field}
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
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
