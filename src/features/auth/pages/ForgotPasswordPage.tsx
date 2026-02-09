"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  CustomFormField,
  FormFieldType,
  SubmitButton,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

import { forgotPasswordSchema } from "@/features/auth/types";
import { usePost } from "@/hooks/useApi";
import type { ApiResponse } from "@/types";
import { getErrorMessage } from "@/lib/utils";

const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().max(6),
});

const resetPasswordSchema = z.object({
  email: z.email(),
  otp: z.string().max(6),
  newPassword: z.string().min(3),
});

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">(
    "email",
  );
  const [userEmail, setUserEmail] = useState("");
  const [userOtp, setUserOtp] = useState("");

  const emailForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const otpForm = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    mode: "onChange",

    defaultValues: { email: "", otp: "" },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "", otp: "", newPassword: "" },
  });

  const sendOtpAction = usePost<
    ApiResponse<{ message: string }>,
    z.infer<typeof forgotPasswordSchema>
  >("/auth/forgot-password", {
    isAuth: false,

    onSuccess: (res) => {
      toast.success(res.message || "Kode OTP telah dikirim ke email Anda");
      setStep("otp");
    },
  });

  const verifyOtpAction = usePost<
    ApiResponse<{ message: string }>,
    z.infer<typeof verifyOtpSchema>
  >("/auth/verify-otp", {
    isAuth: false,
    onSuccess: (res) => {
      toast.success(res.message || "Kode OTP berhasil diverifikasi");
      setStep("reset");
    },
  });

  const resetPasswordAction = usePost<
    ApiResponse<{ message: string }>,
    z.infer<typeof resetPasswordSchema>
  >("/auth/reset-password", {
    isAuth: false,
    onSuccess: (res) => {
      toast.success(res.message || "Password berhasil direset");
      setStep("success");
    },
  });

  const handleEmailSubmit = async (
    values: z.infer<typeof forgotPasswordSchema>,
  ) => {
    setUserEmail(values.email);
    otpForm.setValue("email", values.email);
    try {
      await sendOtpAction.mutateAsync(values);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleOtpSubmit = async (values: z.infer<typeof verifyOtpSchema>) => {
    setUserOtp(values.otp);
    resetForm.setValue("email", values.email);
    resetForm.setValue("otp", values.otp);
    try {
      await verifyOtpAction.mutateAsync(values);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResetSubmit = async (
    values: z.infer<typeof resetPasswordSchema>,
  ) => {
    try {
      await resetPasswordAction.mutateAsync(values);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (step === "email") {
    return (
      <ForgotPasswordForm
        onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
        form={emailForm}
        isLoading={sendOtpAction.isPending}
      />
    );
  }

  if (step === "otp") {
    return (
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Verify OTP Code</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit OTP code sent to{" "}
            <span className="font-medium text-foreground">{userEmail}</span>
          </p>
        </div>

        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
            className="space-y-4"
          >
            <CustomFormField
              control={otpForm.control}
              name="email"
              fieldType={FormFieldType.HIDDEN}
              value={userEmail}
            />
            <CustomFormField
              control={otpForm.control}
              name="otp"
              fieldType={FormFieldType.INPUT}
              label="OTP Code"
              placeholder="123456"
              maxLength={6}
            />

            <SubmitButton
              isValid={otpForm.formState.isValid}
              isLoading={verifyOtpAction.isPending}
            >
              Verify OTP
            </SubmitButton>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep("email")}
              disabled={verifyOtpAction.isPending}
            >
              Back to Email
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password for{" "}
            <span className="font-medium text-foreground">{userEmail}</span>
          </p>
        </div>

        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(handleResetSubmit)}
            className="space-y-4"
          >
            <CustomFormField
              control={resetForm.control}
              name="email"
              fieldType={FormFieldType.HIDDEN}
              value={userEmail}
            />
            <CustomFormField
              control={resetForm.control}
              name="otp"
              fieldType={FormFieldType.HIDDEN}
              value={userOtp}
            />
            <CustomFormField
              control={resetForm.control}
              name="newPassword"
              fieldType={FormFieldType.PASSWORD}
              label="New Password"
              placeholder="Enter new password"
              iconSrc="/icons/lock.svg"
            />

            <SubmitButton
              isLoading={resetPasswordAction.isPending}
              isValid={resetForm.formState.isValid}
            >
              Reset Password
            </SubmitButton>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 text-center space-y-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-green-600 dark:text-green-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-label="Success checkmark"
        >
          <title>Success checkmark</title>
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 className="text-2xl font-bold">Password Reset Successfully</h1>
      <p className="text-muted-foreground text-sm">
        Your password has been successfully reset. Please login with your new
        password.
      </p>
      <Link
        href="/login"
        className="inline-block w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
      >
        Back to Login
      </Link>
    </div>
  );
};
