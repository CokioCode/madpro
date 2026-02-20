"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChartAreaInteractive } from "@/components/charts/ChartAreaInteractive";
import { ChartLineInteractive } from "@/components/charts/ChartLineInteractive";
import { ChartPieInteractive } from "@/components/charts/ChartPieInteractive";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGet } from "@/hooks/useApi";
import { SectionCards } from "@/features/dashboard/components/SectionCards";
import { filterDashSchema } from "../types";

export const DashboardPage = () => {
  const form = useForm({
    resolver: zodResolver(filterDashSchema),
    mode: "onChange",
    defaultValues: {
      hariTerakhir: "30",
    },
  });

  const { data: enumsData } = useGet(["enums"], "/enums", { isAuth: true });
  const statusJtEnum: string[] = enumsData?.data?.statusJt ?? [];

  const handleSubmit = async () => {};

  const handleSelectChange = (value: string) => {
    form.setValue("hariTerakhir", value);
    setTimeout(() => {
      form.handleSubmit(handleSubmit)();
    }, 0);
  };

  return (
    <div className="flex-1 space-y-4 p-4 -mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Overview of your survey management system
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex items-center gap-2"
          >
            <Select
              value={form.watch("hariTerakhir")}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
          </form>
        </Form>
      </div>

      <SectionCards hariTerakhir={Number(form.watch("hariTerakhir"))} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartLineInteractive
            hariTerakhir={Number(form.watch("hariTerakhir"))}
          />
        </div>
        <div className="lg:col-span-1">
          <ChartPieInteractive
            hariTerakhir={Number(form.watch("hariTerakhir"))}
          />
        </div>
      </div>

      <ChartAreaInteractive hariTerakhir={Number(form.watch("hariTerakhir"))} />
    </div>
  );
};
