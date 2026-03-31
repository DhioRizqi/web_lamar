import { z } from "zod";

export const applicationSchema = z.object({
  company: z.string().min(1, "Nama perusahaan wajib diisi"),
  position: z.string().min(1, "Posisi wajib diisi"),
  apply_date: z.string().min(1, "Tanggal apply wajib diisi"),
  job_url: z.string().url("URL tidak valid").or(z.literal("")).optional(),
  notes: z.string().max(1000, "Maksimal 1000 karakter").optional(),
  status: z.enum([
    "applied",
    "review",
    "interview",
    "offer",
    "rejected",
    "ghosted",
    "withdrawn",
    "saved",
  ]),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
