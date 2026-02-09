import { type ClassValue, clsx } from "clsx";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function setCookie(
  name: string,
  value: string,
  options?: Cookies.CookieAttributes,
) {
  Cookies.set(name, value, {
    expires: 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...options,
  });
}

export function removeCookie(name: string) {
  Cookies.remove(name);
}

export function decodeJwt<T = Record<string, unknown>>(
  token?: string,
): T | null {
  if (!token) return null;
  return jwtDecode<T>(token);
}

export function getRelativeTime(dateString: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}

export function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(1)}M`;
  }
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(0)}Jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function parseCurrency(value: string): number {
  return Number(value.replace(/[Rp\s.]/g, ""));
}

export const RAB_RANGES = [
  { label: "< 10 Jt", min: 0, max: 10000000 },
  { label: "10 - 50 Jt", min: 10000000, max: 50000000 },
  { label: "50 - 100 Jt", min: 50000000, max: 100000000 },
  { label: "> 100 Jt", min: 100000000, max: 1000000000 },
] as const;

type ApiErrorPayload = {
  message?: string;
};

export function getErrorMessage(
  error: unknown,
  fallback = "an error occurred",
): string {
  if (!error) return fallback;

  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: unknown }).response;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = (response as { data?: unknown }).data;

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as ApiErrorPayload).message === "string"
      ) {
        return (data as ApiErrorPayload).message || "";
      }
    }
  }
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
export function getStatusJtBadgeVariant(status: string | null) {
  if (!status) return "outline";
  switch (status) {
    case "APPROVE":
    case "APPROVED":
      return "default";
    case "NOT_APPROVE":
    case "DROP_BY_AM":
    case "DROP_BY_WITEL":
    case "REVENUE_KURANG":
    case "AKI_TIDAK_LAYAK":
    case "CANCEL_PELANGGAN":
      return "destructive";
    case "NJKI_BELUM_LENGKAP":
    case "AANWIJZING":
    case "TUNGGU_JPP":
    case "INPUT_PAKET_LAIN":
      return "secondary";
    default:
      return "outline";
  }
}
