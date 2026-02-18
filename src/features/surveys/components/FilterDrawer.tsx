import { zodResolver } from "@hookform/resolvers/zod";
import { FilterIcon, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CustomFormField,
  FormFieldType,
  SubmitButton,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { formatCurrency, RAB_RANGES } from "@/lib/utils";
import { buildFilterSchema, type Filter } from "../types";

interface FilterDrawerProps {
  onFilterChange?: (filters: Filter) => void;
  statusJtEnum: string[];
}

export const FilterDrawer = (props: FilterDrawerProps) => {
  const { onFilterChange } = props;
  const [selectedRange, setSelectedRange] = useState<number | null>(null);
  const [showCustomRange, setShowCustomRange] = useState(false);

  const form = useForm<Filter>({
    resolver: zodResolver(buildFilterSchema(props.statusJtEnum)),
    mode: "onChange",
    defaultValues: {
      rabHldMin: "",
      rabHldMax: "",
      sto: "",
      tahun: "",
    },
  });

  const submitForm = (values: Filter) => {
    onFilterChange?.(values);
  };

  const handleReset = () => {
    const emptyFilter: Filter = {
      rabHldMin: "",
      rabHldMax: "",
      statusJt: [],
      sto: "",
      tahun: "",
    };

    form.reset(emptyFilter);
    setSelectedRange(null);
    setShowCustomRange(false);
    onFilterChange?.(emptyFilter);
  };

  const handlePresetRange = (index: number) => {
    const range = RAB_RANGES[index];
    setSelectedRange(index);
    setShowCustomRange(false);

    form.setValue("rabHldMin", range.min.toString());
    form.setValue("rabHldMax", range.max.toString());
  };

  const handleCustomRange = () => {
    setSelectedRange(null);
    setShowCustomRange(true);
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="default" className="gap-2">
          <FilterIcon className="h-4 w-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="fixed bottom-0 right-0 left-auto mt-0 w-full sm:w-[450px] rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none h-[85vh] sm:h-full">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-semibold">
                Filter Survey
              </DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-muted-foreground">
                Filter surveys berdasarkan status, budget, dan region
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="space-y-6"
              id="filter-form"
            >
              <CustomFormField
                control={form.control}
                name="statusJt"
                fieldType={FormFieldType.MULTISELECT}
                label="Status JT"
                placeholder="Pilih status"
                options={props.statusJtEnum.map((status) => ({
                  value: status,
                  label: status.replaceAll("_", " "),
                }))}
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium">RAB HILD Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  {RAB_RANGES.map((range, index) => (
                    <Button
                      key={range.label}
                      type="button"
                      variant={selectedRange === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePresetRange(index)}
                      className="text-xs"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>

                <Button
                  type="button"
                  variant={showCustomRange ? "default" : "outline"}
                  size="sm"
                  onClick={handleCustomRange}
                  className="w-full text-xs"
                >
                  Custom Range
                </Button>

                {showCustomRange && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <CustomFormField
                        control={form.control}
                        name="rabHldMin"
                        fieldType={FormFieldType.INPUT}
                        label="Min (Rp)"
                        placeholder="0"
                        type="number"
                      />
                      <CustomFormField
                        control={form.control}
                        name="rabHldMax"
                        fieldType={FormFieldType.INPUT}
                        label="Max (Rp)"
                        placeholder="1000000000"
                        type="number"
                      />
                    </div>

                    {form.watch("rabHldMin") && form.watch("rabHldMax") && (
                      <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
                        {formatCurrency(Number(form.watch("rabHldMin")))} -{" "}
                        {formatCurrency(Number(form.watch("rabHldMax")))}
                      </div>
                    )}
                  </div>
                )}

                {selectedRange !== null && !showCustomRange && (
                  <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
                    {formatCurrency(RAB_RANGES[selectedRange].min)} -{" "}
                    {formatCurrency(RAB_RANGES[selectedRange].max)}
                  </div>
                )}
              </div>

              <CustomFormField
                control={form.control}
                name="sto"
                fieldType={FormFieldType.INPUT}
                label="STO"
                placeholder="Masukkan STO"
              />

              <CustomFormField
                control={form.control}
                name="tahun"
                fieldType={FormFieldType.INPUT}
                label="Tahun"
                placeholder="Contoh: 2024"
              />
            </form>
          </Form>
        </div>

        <DrawerFooter className="border-t pt-4 gap-2">
          <SubmitButton
            form="filter-form"
            isLoading={form.formState.isSubmitting}
            isValid={form.formState.isValid}
            className="w-full"
          >
            Terapkan Filter
          </SubmitButton>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full"
          >
            Reset Filter
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
