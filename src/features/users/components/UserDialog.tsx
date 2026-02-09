import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CustomFormField,
  FormFieldType,
  SubmitButton,
} from "@/components/forms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type CreateUser,
  createUserSchema,
  type UpdateUser,
  type User,
  updateUserSchema,
} from "../types";

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUser | UpdateUser) => Promise<void>;
  user?: User | null;
  mode?: "create" | "edit";
}

export const UserDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  user = null,
  mode = "create",
}: UserDialogProps) => {
  const isEditMode = mode === "edit" && user;

  const form = useForm<CreateUser | UpdateUser>({
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
    mode: "onChange",
    defaultValues: isEditMode
      ? {
          name: "",
          username: "",
          role: "USER",
          email: "",
          oldPassword: "",
          newPassword: "",
        }
      : {
          name: "",
          username: "",
          password: "",
          email: "",
          role: "USER",
        },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        form.reset({
          name: user.name,
          username: user.username,
          role: user.role,
          oldPassword: "",
          newPassword: "",
          email: user.email || "",
        });
      } else {
        form.reset({
          name: "",
          username: "",
          password: "",
          role: "USER",
          email: "",
        });
      }
    }
  }, [isOpen, isEditMode, user, form]);

  const handleSubmit = async (data: CreateUser | UpdateUser) => {
    try {
      let payload: CreateUser | UpdateUser = data;

      if (isEditMode) {
        const { oldPassword, newPassword, ...rest } = data as UpdateUser;

        payload =
          oldPassword && newPassword
            ? { ...rest, oldPassword, newPassword }
            : rest;
      }

      await onSubmit(payload);
      form.reset();
    } catch {}
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the user information below."
              : "Add a new user to your system. Fill in the required information below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-2">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="username"
                  label="Username"
                  placeholder="johndoe"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="johndoe@gmail.com"
                />
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-6">
                {isEditMode ? (
                  <>
                    <CustomFormField
                      fieldType={FormFieldType.PASSWORD}
                      control={form.control}
                      name="oldPassword"
                      label="Current Password"
                      placeholder="Enter current password"
                    />

                    <CustomFormField
                      fieldType={FormFieldType.PASSWORD}
                      control={form.control}
                      name="newPassword"
                      label="New Password"
                      placeholder="Enter new password"
                    />
                  </>
                ) : (
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                  />
                )}

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="role"
                  label="Role"
                  placeholder="Select a role"
                >
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </CustomFormField>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <SubmitButton
                isValid={form.formState.isValid}
                isLoading={form.formState.isSubmitting}
              >
                {isEditMode ? "Update User" : "Create User"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
