import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CustomFormField,
  FormFieldType,
  SubmitButton,
} from "@/components/forms";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusJtBadgeVariant } from "@/lib/utils";
import { type Survey, type UpdateSurvey, updateSurveySchema } from "../types";

interface SurveyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateSurvey) => Promise<void>;
  survey: Survey;
  statusJtEnum: string[];
}

export const SurveyDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  survey,
  statusJtEnum,
}: SurveyDialogProps) => {
  const form = useForm<UpdateSurvey>({
    resolver: zodResolver(updateSurveySchema as any),
    mode: "onChange",
    defaultValues: {
      statusJt: "",
      nomorNcx: "",
      alamat: "",
      jenisLayanan: "",
      nilaiKontrak: "",
      rabSurvey: 0,
      noNde: "",
      progresJt: "",
      namaOdp: "",
      jarakOdp: 0,
      keteranganText: "",
    },
  });

  useEffect(() => {
    if (isOpen && survey) {
      form.reset({
        statusJt: survey.statusJt || "",
        nomorNcx: survey.nomorNcx || "",
        alamat: survey.alamat || "",
        jenisLayanan: survey.jenisLayanan || "",
        nilaiKontrak: survey.nilaiKontrak || "",
        rabSurvey: survey.rabSurvey || 0,
        noNde: survey.noNde || "",
        progresJt: survey.progresJt || "",
        namaOdp: survey.namaOdp || "",
        jarakOdp: Number(survey.jarakOdp) || 0,
        keteranganText: survey.keteranganText || "",
      });
    }
  }, [isOpen, survey, form]);

  const handleSubmit = async (data: UpdateSurvey) => {
    try {
      const submitData = {
        ...data,
        jarakOdp: Number(data.jarakOdp),
        rabSurvey: Number(data.rabSurvey),
      };

      await onSubmit(submitData);
      form.reset();
    } catch (error) {
      console.error("Error updating survey:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Survey</DialogTitle>
          <DialogDescription>
            Update informasi survey untuk {survey.namaPelanggan}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Tabs defaultValue="status" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="status">Status & Progress</TabsTrigger>
                <TabsTrigger value="customer">Info Pelanggan</TabsTrigger>
                <TabsTrigger value="financial">Finansial</TabsTrigger>
                <TabsTrigger value="technical">Teknis</TabsTrigger>
              </TabsList>

              <TabsContent value="status" className="space-y-4 mt-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="statusJt"
                  label="Status JT"
                  placeholder="Pilih status"
                >
                  {statusJtEnum.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="progresJt"
                  label="Progress JT"
                  placeholder="Contoh: 75%"
                />
              </TabsContent>

              <TabsContent value="customer" className="space-y-4 mt-6">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="nomorNcx"
                  label="Nomor NCX"
                  placeholder="1001645422"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="alamat"
                  label="Alamat"
                  placeholder="Alamat lengkap pelanggan"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="jenisLayanan"
                  label="Jenis Layanan"
                  placeholder="HSI Bisnis Bundling Netmonk PSB 70% - 200 Mbps"
                />
              </TabsContent>

              <TabsContent value="financial" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="nilaiKontrak"
                    label="Nilai Kontrak (IDR)"
                    placeholder="12810000"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="rabSurvey"
                    label="RAB Survey (IDR)"
                    placeholder="32713900"
                    type="number"
                  />
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="noNde"
                    label="No NDE"
                    placeholder="NDE001"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="namaOdp"
                    label="Nama ODP"
                    placeholder="ODP-001"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="jarakOdp"
                    label="Jarak ODP (meter)"
                    placeholder="100"
                    type="number"
                  />
                </div>

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="keteranganText"
                  label="Keterangan"
                  placeholder="Keterangan tambahan (optional)"
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2">
              <SubmitButton
                isValid={form.formState.isValid}
                isLoading={form.formState.isSubmitting}
              >
                Update Survey
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface SurveyDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  survey: Survey | null;
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="grid grid-cols-3 gap-4 py-3">
    <dt className="text-sm font-medium text-slate-500">{label}</dt>
    <dd className="text-sm text-slate-900 col-span-2">{value || "-"}</dd>
  </div>
);

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const SurveyDetailDialog = ({
  isOpen,
  onOpenChange,
  survey,
}: SurveyDetailDialogProps) => {
  if (!survey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detail Survey</DialogTitle>
          <DialogDescription>
            Informasi lengkap survey pelanggan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              Informasi Pelanggan
            </h3>
            <dl className="divide-y divide-slate-200">
              <DetailRow label="Nama Pelanggan" value={survey.namaPelanggan} />
              <DetailRow label="ID Kendala" value={survey.idKendala} />
              <DetailRow label="Nomor NCX" value={survey.nomorNcx} />
              <DetailRow label="Alamat" value={survey.alamat} />
              <DetailRow label="Jenis Layanan" value={survey.jenisLayanan} />
            </dl>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              Informasi Lokasi
            </h3>
            <dl className="divide-y divide-slate-200">
              <DetailRow label="Datel" value={survey.datel} />
              <DetailRow label="STO" value={survey.sto} />
              <DetailRow label="Nama ODP" value={survey.namaOdp} />
              <DetailRow
                label="Jarak ODP"
                value={survey.jarakOdp ? `${survey.jarakOdp} meter` : "-"}
              />
            </dl>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              Status & Progress
            </h3>
            <dl className="divide-y divide-slate-200">
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-slate-500">
                  Status JT
                </dt>
                <dd className="col-span-2">
                  <Badge
                    variant={getStatusJtBadgeVariant(survey.statusJt)}
                    className="font-medium"
                  >
                    {survey.statusJt?.replace("_", " ") || "-"}
                  </Badge>
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-slate-500">
                  Status Usulan
                </dt>
                <dd className="col-span-2">
                  <Badge
                    variant={getStatusJtBadgeVariant(survey.statusUsulan)}
                    className="font-medium"
                  >
                    {survey.statusUsulan?.replace("_", " ") || "-"}
                  </Badge>
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-slate-500">
                  Status IHLD
                </dt>
                <dd className="col-span-2">
                  <Badge variant="outline" className="font-medium">
                    {survey.statusIhld || "-"}
                  </Badge>
                </dd>
              </div>
              <DetailRow label="Progress JT" value={survey.progresJt} />
              <DetailRow label="Jenis Order" value={survey.jenisOrder} />
            </dl>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              Informasi Finansial
            </h3>
            <dl className="divide-y divide-slate-200">
              <DetailRow
                label="Nilai Kontrak"
                value={formatCurrency(Number(survey.nilaiKontrak))}
              />
              <DetailRow
                label="RAB Survey"
                value={formatCurrency(survey.rabSurvey)}
              />
              <DetailRow
                label="RAB HLD Summary"
                value={formatCurrency(survey.rabHldSummary)}
              />
              <DetailRow label="IHLD" value={formatCurrency(survey.ihld)} />
              <DetailRow label="C2R" value={survey.c2r} />
            </dl>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              Informasi Teknis
            </h3>
            <dl className="divide-y divide-slate-200">
              <DetailRow label="No NDE" value={survey.noNde} />
              <DetailRow label="Keterangan" value={survey.keteranganText} />
            </dl>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              Timeline
            </h3>
            <dl className="divide-y divide-slate-200">
              <DetailRow
                label="Tanggal Input"
                value={formatDate(survey.tglInput)}
              />
              <DetailRow
                label="Created At"
                value={formatDate(survey.createdAt)}
              />
              <DetailRow
                label="Updated At"
                value={formatDate(survey.updatedAt)}
              />
            </dl>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
