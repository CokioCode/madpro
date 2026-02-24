import { z } from "zod";

export const jenisKendalaEnum = z.enum([
  "ODP_FULL",
  "JARAK_PT1_250",
  "BLANK_FO",
  "JARAK_JAUH_500",
  "BLANK_TIANG",
  "NEED_MATAM_3PCS",
]);

export const planTematikEnum = z.enum([
  "PT1",
  "PT2S",
  "PT2NS",
  "PT3",
  "PT4",
  "TKAP",
]);

export const statusUsulanEnum = z.enum([
  "REVIEW_SDI",
  "BELUM_INPUT",
  "REVIEW_OPTIMA",
  "REVIEW_ED",
  "CEK_SDI_REGIONAL",
  "APPROVED",
  "DROP_LOP",
  "KONFIRMASI_ULANG",
  "NOT_APPROVED",
  "PENDING",
  "CANCEL",
  "OGP_IHLD",
  "WAITING_CARING",
]);

export const projectStatusEnum = z.enum([
  "REVIEW",
  "SURVEY",
  "INSTALASI",
  "DONE_INSTALASI",
  "GO_LIVE",
  "CANCEL",
  "PENDING",
  "KENDALA",
  "WAITING_BUDGET",
  "DROP",
  "WAITING_PROJECT_JPP",
  "WAITING_CB",
]);

export const projectIssueEnum = z.enum([
  "PELANGGAN_BATAL",
  "PT1_ONLY",
  "PERIJINAN",
  "AKI_TIDAK_LAYAK",
  "REDESIGN",
  "INDIKASI_RESELLER",
  "FEEDER_HABIS",
  "KENDALA_IZIN_TANAM_TN",
  "PORT_OLT_HABIS",
  "MATTAM_TIANG",
  "DISTRIBUSI_HABIS",
  "MENUNGGU_M_OLT",
  "MENUNGGU_RELOKASI_TIANG_PLN",
  "CORE_DISTRIBUSI_CACAT",
  "MENUNGGU_CO_FEEDER",
  "PORT_EA_HABIS",
  "INVALID_LOCATION",
  "HOLD_BY_BGES",
  "WAITING_REVIT_ODP",
  "HOLD_BY_PED",
]);

export const statusJtEnum = [
  "APPROVE",
  "NOT_APPROVE",
  "DROP_BY_AM",
  "DROP_BY_WITEL",
  "REVENUE_KURANG",
  "AKI_TIDAK_LAYAK",
  "NJKI_BELUM_LENGKAP",
  "AANWIJZING",
  "TUNGGU_JPP",
  "CANCEL_PELANGGAN",
  "INPUT_PAKET_LAIN",
] as const;

export const buildFilterSchema = (statusEnum: string[]) =>
  z.object({
    statusJt: z
      .array(z.string())
      .optional()
      .refine((val) => !val || val.every((v) => statusEnum.includes(v)), {
        message: "Status tidak valid",
      }),

    rabHldMin: z.string().optional(),
    rabHldMax: z.string().optional(),
    sto: z.string().optional(),
    hariTerakhir: z.string().optional(),

    statusUsulanNot: z
      .array(z.string())
      .optional()
      .refine((val) => !val || val.every((v) => statusEnum.includes(v)), {
        message: "Status tidak valid",
      }),

    dateRange: z.tuple([z.date().nullable(), z.date().nullable()]).optional(),
  });

export type Filter = {
  statusJt?: string[];
  rabHldMin?: string;
  rabHldMax?: string;
  sto?: string;
  hariTerakhir?: string;
  statusUsulanNot?: string[];
  dateRange?: [Date | null, Date | null];
};

export const surveySchema = z.object({
  id: z.uuid(),
  no: z.string(),
  bln: z.string(),
  tglInput: z.iso.datetime(),
  idKendala: z.string(),
  jenisOrder: z.string(),
  datel: z.string(),
  sto: z.string(),
  namaPelanggan: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  jenisKendala: z.string(),
  pltTemuan: z.string(),
  rabHldSummary: z.number(),
  ihld: z.number(),
  statusUsulan: z.string().nullable(),
  statusIhld: z.string(),
  idEprop: z.string().nullable(),
  statusInstalasi: z.string().nullable(),
  keterangan: z.string().nullable(),
  newSc: z.string(),
  statusJt: z.enum(statusJtEnum),
  c2r: z.number(),
  nomorNcx: z.string(),
  alamat: z.string(),
  jenisLayanan: z.string(),
  nilaiKontrak: z.string(),
  ihldLop: z.number(),
  planTematik: z.string(),
  rabHldDetail: z.string(),
  rabSurvey: z.number().nullable(),
  noNde: z.string().nullable(),
  progresJt: z.string().nullable(),
  namaOdp: z.string().nullable(),
  jarakOdp: z.string().nullable(),
  keteranganText: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const createSurveySchema = z.object({
  statusJt: z.string().optional(),
  nomorNcx: z.string().optional(),
  alamat: z.string().optional(),
  jenisLayanan: z.string().optional(),
  nilaiKontrak: z.string().optional(),
  rabSurvey: z.coerce.number().optional(),
  noNde: z.string().optional(),
  progresJt: z.string().optional(),
  namaOdp: z.string().optional(),
  jarakOdp: z.coerce.number().optional(),
  keteranganText: z.string().optional(),
});

export const updateSurveySchema = createSurveySchema.partial();

export type Survey = z.infer<typeof surveySchema>;
export type CreateSurvey = z.infer<typeof createSurveySchema>;
export type UpdateSurvey = z.infer<typeof updateSurveySchema>;

export type JenisKendala = z.infer<typeof jenisKendalaEnum>;
export type PlanTematik = z.infer<typeof planTematikEnum>;
export type StatusUsulan = z.infer<typeof statusUsulanEnum>;
export type ProjectStatus = z.infer<typeof projectStatusEnum>;
export type ProjectIssue = z.infer<typeof projectIssueEnum>;
