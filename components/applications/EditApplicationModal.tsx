"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Application } from "@/types";
import { ApplicationFormValues, applicationSchema } from "@/lib/validations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application;
}

export function EditApplicationModal({
  open,
  onOpenChange,
  application,
}: EditApplicationModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: application.company,
      position: application.position,
      apply_date: application.apply_date,
      job_url: application.job_url ?? "",
      notes: application.notes ?? "",
      status: application.status,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      company: application.company,
      position: application.position,
      apply_date: application.apply_date,
      job_url: application.job_url ?? "",
      notes: application.notes ?? "",
      status: application.status,
    });
  }, [open, application, reset]);

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          company: data.company,
          position: data.position,
          apply_date: data.apply_date,
          job_url: data.job_url || null,
          notes: data.notes || null,
        })
        .eq("id", application.id);

      if (error) throw error;

      toast.success("Berhasil", { description: "Lamaran berhasil diperbarui." });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
      toast.error("Gagal menyimpan", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-surface border-app">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-main">Edit Lamaran</DialogTitle>
          <DialogDescription className="text-secondary">
            Perbarui detail lamaran. Status awal tidak bisa diubah dari form ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-main font-medium">
              Nama Perusahaan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="company"
              className={cn("bg-main h-10", errors.company && "border-destructive")}
              {...register("company")}
            />
            {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="position" className="text-main font-medium">
              Posisi <span className="text-destructive">*</span>
            </Label>
            <Input
              id="position"
              className={cn("bg-main h-10", errors.position && "border-destructive")}
              {...register("position")}
            />
            {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
          </div>

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
              <Label className="text-main font-medium">Status</Label>
              <Input value={application.status} readOnly disabled className="bg-main h-10 opacity-70" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="job_url" className="text-main font-medium">
              URL Lowongan <span className="text-hint text-xs font-normal">(opsional)</span>
            </Label>
            <Input
              id="job_url"
              type="url"
              className="bg-main h-10"
              placeholder="https://..."
              {...register("job_url")}
            />
            {errors.job_url && <p className="text-xs text-destructive">{errors.job_url.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-main font-medium">
              Catatan <span className="text-hint text-xs font-normal">(opsional)</span>
            </Label>
            <textarea
              id="notes"
              rows={3}
              className="w-full rounded-lg border border-input bg-main px-3 py-2 text-sm text-main placeholder:text-hint focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 resize-none transition-colors"
              {...register("notes")}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" className="border-app" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button disabled={isSubmitting} type="submit" className="bg-sage hover:bg-sage-hover text-white font-medium">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
