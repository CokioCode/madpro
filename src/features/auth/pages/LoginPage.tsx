"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { loginSchema } from "@/features/auth/types";
import { usePost } from "@/hooks/useApi";
import { setCookie } from "@/lib/utils";
import type { ApiResponse } from "@/types";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
    role?: "USER" | "ADMIN";
  };
}

export const LoginPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginAction = usePost<
    ApiResponse<LoginResponse>,
    z.infer<typeof loginSchema>
  >("/auth/login", {
    isAuth: false,
    invalidateQueries: [["users"]],
    onSuccess: (response) => {
      toast.success(response.message);

      if (response.data?.token) {
        setCookie("token", response.data.token);
      }

      const dashboardPath =
        response.data.user.role === "USER"
          ? "/users/dashboard"
          : "/admin/dashboard";
      router.replace(dashboardPath);
    },

    onError: (res) => {
      toast.error(
        (res.response?.data as { message?: string })?.message ||
          "An error occurred",
      );
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      await loginAction.mutateAsync(values);
    } catch {}
  };

  return (
    <LoginForm
      onSubmit={form.handleSubmit(handleLogin)}
      form={form}
      isLoading={loginAction.isPending}
    />
  );
};
