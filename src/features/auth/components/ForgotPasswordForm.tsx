import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import {
  CustomFormField,
  FormFieldType,
} from "@/components/forms/CustomFormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import type { ForgotPassword } from "@/features/auth/types";
import { cn } from "@/lib/utils";

interface ForgotPasswordFormProps extends React.ComponentProps<"form"> {
  form: UseFormReturn<ForgotPassword>;
  isLoading: boolean;
}

export const ForgotPasswordForm = ({
  className,
  isLoading,
  form,
  ...props
}: ForgotPasswordFormProps) => {
  return (
    <Form {...form}>
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup className="rounded-lg border bg-card p-6">
          <div className="flex flex-col items-center gap-1 text-center mb-2">
            <h1 className="text-2xl font-bold">Forgot your password?</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email and we'll send you a code to reset your password
            </p>
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            placeholder="john@example.com"
            iconSrc="/icons/email.svg"
          />
          <SubmitButton isValid={form.formState.isValid} isLoading={isLoading}>
            Send Code
          </SubmitButton>
          <Field>
            <FieldDescription className="text-center">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Back to Login
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
};
