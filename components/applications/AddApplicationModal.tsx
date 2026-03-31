"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplicationFormValues, applicationSchema } from "@/lib/validations";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddApplicationModal({ open, onOpenChange }: AddApplicationModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: "",
      position: "",
      apply_date: "", // Default empty to avoid SSR hydration mismatch
      job_url: "",
      notes: "",
      status: "applied",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        company: "",
        position: "",
        apply_date: format(new Date(), "yyyy-MM-dd"), // set on client when opened
        job_url: "",
        notes: "",
        status: "applied",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Anda belum login!");
        return;
      }

      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        company: data.company,
        position: data.position,
        apply_date: data.apply_date,
        job_url: data.job_url || null,
        notes: data.notes || null,
        status: data.status,
      });

      if (error) throw error;

      toast.success("Berhasil", { description: "Lamaran berhasil ditambahkan!" });
      onOpenChange(false);
      reset();
      router.refresh();
    } catch (err: any) {
      toast.error("Gagal menyimpan", { description: err.message || "Terjadi kesalahan." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-surface border-app">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-main">Tambah Lamaran</DialogTitle>
          <DialogDescription className="text-secondary">
            Masukkan detail pekerjaan yang baru saja atau ingin dilamar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Company */}
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-main font-medium">
              Nama Perusahaan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="company"
              placeholder="Contoh: Tokopedia"
              className={cn("bg-main h-10", errors.company && "border-destructive")}
              {...register("company")}
            />
            {errors.company && (
              <p className="text-xs text-destructive">{errors.company.message}</p>
            )}
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <Label htmlFor="position" className="text-main font-medium">
              Posisi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="position"
              placeholder="Contoh: Frontend Engineer"
              className={cn("bg-main h-10", errors.position && "border-destructive")}
              {...register("position")}
            />
            {errors.position && (
              <p className="text-xs text-destructive">{errors.position.message}</p>
            )}
          </div>

          {/* Date + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="apply_date" className="text-main font-medium">
                Tanggal Apply <span className="text-destructive">*</span>
              </Label>
              <Input
                id="apply_date"
                type="date"
                className={cn("bg-main h-10", errors.apply_date && "border-destructive")}
                {...register("apply_date")}
              />
              {errors.apply_date && (
                <p className="text-xs text-destructive">{errors.apply_date.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-main font-medium">
                Status Awal <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-main h-10 w-full">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.emoji} {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Job URL */}
          <div className="space-y-1.5">
            <Label htmlFor="job_url" className="text-main font-medium">
              URL Lowongan <span className="text-hint text-xs font-normal">(opsional)</span>
            </Label>
            <Input
              id="job_url"
              type="url"
              placeholder="https://..."
              className="bg-main h-10"
              {...register("job_url")}
            />
            {errors.job_url && (
              <p className="text-xs text-destructive">{errors.job_url.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-main font-medium">
              Catatan <span className="text-hint text-xs font-normal">(opsional)</span>
            </Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Interview online via Zoom, kontak HR: ..."
              className="w-full rounded-lg border border-input bg-main px-3 py-2 text-sm text-main placeholder:text-hint focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 resize-none transition-colors"
              {...register("notes")}
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-app"
              onClick={handleClose}
            >
              Batal
            </Button>
            <Button
              disabled={isSubmitting}
              type="submit"
              className="bg-sage hover:bg-sage-hover text-white font-medium disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan Lamaran
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
