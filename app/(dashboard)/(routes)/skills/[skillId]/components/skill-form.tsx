"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Trash } from "lucide-react";
import { Skill } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modal/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";

interface SkillFormProps {
  initialData: Skill | null;
  userId: string;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().nullable(),
  proficiency: z.string(),
});

type SkillFormValues = z.infer<typeof formSchema>;

export const proficiencies = ["Beginner", "Fluent", "Intermediate"];

export const SkillForm: React.FC<SkillFormProps> = ({
  initialData,
  userId,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit Skill" : "Create Skill";
  const description = initialData ? "Edit a Skill" : "Add a new Skill";
  const toastMessage = initialData ? "Skill updated." : "Skill created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      proficiency: proficiencies[0],
    },
  });

  const onSubmit = async (data: SkillFormValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(`/api/${userId}/skills/${params.skillId}`, data);
      } else {
        await axios.post(`/api/${userId}/skills/`, data);
      }
      router.refresh();
      router.push(`/skills`);
      toast({
        title: toastMessage,
        description: "Change data with " + toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Skills Error " + error.response.status,
        description: error.response.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${userId}/skills/${params.skillId}`);
      router.refresh();
      router.push(`/skills`);
      toast({
        title: toastMessage,
        description: "Change data with" + toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Skills Error " + error.response.status,
        description:
          "This skills already used by another work/project " +
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Image</FormLabel>
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Label of your Skill"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency</FormLabel>
                  <FormControl>
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
                        {proficiencies.length === 0 && (
                          <SelectItem disabled value="">
                            Fill role on Roles Page
                          </SelectItem>
                        )}
                        {proficiencies.map((role, index) => (
                          <SelectItem key={index} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
