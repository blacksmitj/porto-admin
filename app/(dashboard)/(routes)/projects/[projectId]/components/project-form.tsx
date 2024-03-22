"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { Role, Project, Skill } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { MultiSelect } from "@/components/ui/multi-select";
import { AlertModal } from "@/components/modal/alert-modal";
import { ImageLandscapeUpload } from "@/components/ui/image-landscape-upload";

interface ProjectFormProps {
  initialData: (Project & { skills: string[] }) | undefined;
  roles: Role[];
  skills: Skill[];
  userId: string;
}

const formSchema = z.object({
  roleId: z.string().min(1),
  skills: z.string().array(),
  company: z.string().min(1),
  label: z.string().min(1),
  workDate: z.date(),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  linkUrl: z.string().min(1),
  githubUrl: z.string().nullable(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  roles,
  skills,
  userId,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit Project" : "Create Project";
  const description = initialData ? "Edit a Project" : "Add a new Project";
  const toastMessage = initialData ? "Project updated." : "Project created.";
  const action = initialData ? "Save changes" : "Create";

  const formattedSkills = skills.map((item) => ({
    value: item.id,
    label: item.label,
  }));

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      roleId: undefined,
      skills: [],
      company: "",
      label: "",
      workDate: undefined,
      description: "",
      imageUrl: "",
      linkUrl: "",
      githubUrl: "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    console.log(data);

    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(`/api/${userId}/projects/${params.projectId}`, data);
      } else {
        await axios.post(`/api/${userId}/projects`, data);
      }
      router.refresh();
      router.push(`/projects`);
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
      await axios.delete(`/api/${userId}/projects/${params.roleId}`);
      router.refresh();
      router.push(`/projects`);
      toast({
        title: toastMessage,
        description: "Change data with" + toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Projects Error " + error.response.status,
        description: error.response.data,
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
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <ImageLandscapeUpload
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your Project Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="workDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Date</FormLabel>
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
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github Url</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your project github?"
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
              name="linkUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Url</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your project Link?"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology</FormLabel>
                    <FormControl>
                      <MultiSelect
                        disable={isLoading}
                        options={formattedSkills}
                        value={field.value.map((item) => item)}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
