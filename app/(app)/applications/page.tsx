import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Application } from "@/types";
import { ApplicationsClient } from "@/components/applications/ApplicationsClient";

export const metadata: Metadata = {
  title: "Lamaran - Applyo",
  description: "Kelola lamaran pekerjaan Anda",
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let applications: Application[] = [];

  if (user) {
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      applications = data as Application[];
    }
  }

  return <ApplicationsClient initialApplications={applications} />;
}
